# -*- coding: utf-8 -*-

import json
from contextlib import ExitStack
from unittest.mock import patch

from odoo.tests.common import TransactionCase

from odoo.addons.tattoo_studio.controllers.auth import TattooAuthController
from odoo.addons.tattoo_studio.controllers.artist import TattooArtistController
from odoo.addons.tattoo_studio.controllers.gallery import TattooGalleryController
from odoo.addons.tattoo_studio.controllers.product import TattooProductController
from odoo.addons.tattoo_studio.controllers.service import TattooServiceController


TEST_IMAGE = (
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a2kAAAAASUVORK5CYII='
)


class FakeHttpRequest:
    def __init__(self, method='GET', headers=None, json_data=None, params=None, data=None):
        self.method = method
        self.headers = headers or {}
        self._json_data = json_data
        self.params = params or {}
        self.args = self.params
        self.data = data if data is not None else (
            json.dumps(json_data).encode('utf-8') if json_data is not None else b''
        )

    def get_json(self, silent=True):
        return self._json_data


class FakeRequest:
    def __init__(self, env, method='GET', headers=None, json_data=None, params=None, data=None):
        self.env = env
        self.httprequest = FakeHttpRequest(
            method=method,
            headers=headers,
            json_data=json_data,
            params=params,
            data=data,
        )
        self.params = self.httprequest.params


class TattooManagementApiCase(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        group_system = cls.env.ref('base.group_system')

        cls.portal_user = cls.env['res.users'].sudo().create({
            'name': 'Portal User',
            'login': 'portal-user@example.com',
            'password': 'secret',
            'share': True,
            'api_token': 'portal-token',
        })

        cls.internal_user = cls.env['res.users'].sudo().create({
            'name': 'Internal User',
            'login': 'internal-user@example.com',
            'password': 'secret',
            'share': False,
            'api_token': 'internal-token',
        })

        cls.admin_user = cls.env['res.users'].sudo().create({
            'name': 'Admin User',
            'login': 'admin-user@example.com',
            'password': 'secret',
            'share': False,
            'api_token': 'admin-token',
            'groups_id': [(4, group_system.id)],
        })

        cls.artist = cls.env['tattoo.artist'].sudo().create({
            'name': 'Artist One',
            'email': 'artist@example.com',
            'phone': '555-0101',
            'specialization': 'Blackwork',
            'biography': 'Reference artist for tests.',
            'years_of_experience': 7,
            'is_available': True,
            'active': True,
        })

        cls.service = cls.env['tattoo.service'].sudo().create({
            'name': 'Small Linework',
            'service_type': 'small',
            'base_price': 120.0,
            'description': 'Tiny linework session.',
            'estimated_time_hours': 1.0,
            'available_colors': 'black',
            'active': True,
        })

        cls.product = cls.env['product.template'].sudo().create({
            'name': 'Aftercare Cream',
            'list_price': 18.5,
            'standard_price': 10.0,
            'brand': 'Ink Care',
            'code': 'AF-001',
            'active': True,
        })

        cls.gallery_item = cls.env['tattoo.artist.gallery'].sudo().create({
            'name': 'Galaxy Piece',
            'artist_id': cls.artist.id,
            'tattoo_type': 'realism',
            'description': 'Galaxy themed piece.',
            'work_date': '2026-01-05',
            'sequence': 10,
            'active': True,
            'image': TEST_IMAGE,
        })

    def _patched_request(self, fake_request, module_paths):
        stack = ExitStack()
        for module_path in module_paths:
            stack.enter_context(patch(module_path, fake_request))
        return stack

    def _json(self, response):
        return json.loads(response.get_data(as_text=True))

    def test_auth_roles(self):
        controller = TattooAuthController()

        self.assertEqual(controller._get_user_role(self.portal_user), 'portal')
        self.assertEqual(controller._get_user_role(self.internal_user), 'internal')
        self.assertEqual(controller._get_user_role(self.admin_user), 'admin')

        payload = controller._serialize_user(self.admin_user)
        self.assertTrue(payload['is_admin'])
        self.assertFalse(payload['is_portal'])
        self.assertEqual(payload['role'], 'admin')

    def test_portal_user_cannot_mutate_internal_products(self):
        fake_request = FakeRequest(
            self.env,
            method='POST',
            headers={'Authorization': 'Bearer portal-token'},
            json_data={'name': 'Forbidden Product', 'price': 9.99},
        )

        controller = TattooProductController()
        with self._patched_request(
            fake_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.product.request',
            ],
        ):
            response = controller.products()

        self.assertEqual(response.status_code, 403)
        self.assertEqual(self._json(response)['message'], 'forbidden')

    def test_internal_product_crud(self):
        controller = TattooProductController()

        create_request = FakeRequest(
            self.env,
            method='POST',
            headers={'Authorization': 'Bearer internal-token'},
            json_data={
                'name': 'Healing Balm',
                'brand': 'Ink Care',
                'code': 'HB-02',
                'price': 21.5,
                'cost_price': 12.0,
                'description': 'Calming balm for aftercare.',
                'active': True,
            },
        )

        with self._patched_request(
            create_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.product.request',
            ],
        ):
            response = controller.products()

        payload = self._json(response)
        self.assertEqual(response.status_code, 201)
        product_id = payload['data']['id']

        update_request = FakeRequest(
            self.env,
            method='PUT',
            headers={'Authorization': 'Bearer internal-token'},
            json_data={'price': 23.0, 'active': False},
        )
        with self._patched_request(
            update_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.product.request',
            ],
        ):
            response = controller.product_detail(product_id)

        payload = self._json(response)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(payload['data']['price'], 23.0)
        self.assertFalse(payload['data']['active'])

        delete_request = FakeRequest(
            self.env,
            method='DELETE',
            headers={'Authorization': 'Bearer internal-token'},
        )
        with self._patched_request(
            delete_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.product.request',
            ],
        ):
            response = controller.product_detail(product_id)

        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.env['product.template'].sudo().browse(product_id).exists())

    def test_internal_artist_and_gallery_crud(self):
        artist_controller = TattooArtistController()
        gallery_controller = TattooGalleryController()

        artist_create_request = FakeRequest(
            self.env,
            method='POST',
            headers={'Authorization': 'Bearer internal-token'},
            json_data={
                'name': 'New Artist',
                'email': 'new@example.com',
                'phone': '555-2020',
                'specialization': 'Realism',
                'biography': 'Created from the API.',
                'years_of_experience': 4,
                'is_available': True,
                'active': True,
            },
        )

        with self._patched_request(
            artist_create_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.artist.request',
            ],
        ):
            response = artist_controller.artists()

        payload = self._json(response)
        self.assertEqual(response.status_code, 201)
        artist_id = payload['data']['id']

        gallery_create_request = FakeRequest(
            self.env,
            method='POST',
            headers={'Authorization': 'Bearer internal-token'},
            json_data={
                'name': 'Fresh Piece',
                'artist_id': artist_id,
                'tattoo_type': 'realism',
                'description': 'Created during the test.',
                'sequence': 15,
                'active': True,
                'image': TEST_IMAGE,
            },
        )

        with self._patched_request(
            gallery_create_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.gallery.request',
            ],
        ):
            response = gallery_controller.gallery()

        payload = self._json(response)
        self.assertEqual(response.status_code, 201)
        gallery_id = payload['data']['id']

        update_request = FakeRequest(
            self.env,
            method='PATCH',
            headers={'Authorization': 'Bearer internal-token'},
            json_data={'active': False, 'name': 'Fresh Piece Updated'},
        )
        with self._patched_request(
            update_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.gallery.request',
            ],
        ):
            response = gallery_controller.gallery_detail(gallery_id)

        payload = self._json(response)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(payload['data']['active'])
        self.assertEqual(payload['data']['name'], 'Fresh Piece Updated')

        delete_request = FakeRequest(
            self.env,
            method='DELETE',
            headers={'Authorization': 'Bearer internal-token'},
        )
        with self._patched_request(
            delete_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.artist.request',
                'odoo.addons.tattoo_studio.controllers.gallery.request',
            ],
        ):
            response = artist_controller.artist_detail(artist_id)

        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.env['tattoo.artist'].sudo().browse(artist_id).exists())

    def test_internal_service_crud(self):
        controller = TattooServiceController()

        create_request = FakeRequest(
            self.env,
            method='POST',
            headers={'Authorization': 'Bearer internal-token'},
            json_data={
                'name': 'Medium Session',
                'type': 'medium',
                'price': 220.0,
                'estimatedTimeHours': 2.5,
                'colors': 'color',
                'description': 'Color session.',
                'active': True,
                'artist_ids': [self.artist.id],
            },
        )

        with self._patched_request(
            create_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.service.request',
            ],
        ):
            response = controller.services()

        payload = self._json(response)
        self.assertEqual(response.status_code, 201)
        service_id = payload['data']['id']
        self.assertIn(self.artist.id, payload['data']['artist_ids'])

        update_request = FakeRequest(
            self.env,
            method='PUT',
            headers={'Authorization': 'Bearer internal-token'},
            json_data={'price': 245.0, 'active': False},
        )
        with self._patched_request(
            update_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.service.request',
            ],
        ):
            response = controller.service_detail(service_id)

        payload = self._json(response)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(payload['data']['price'], 245.0)
        self.assertFalse(payload['data']['active'])

        delete_request = FakeRequest(
            self.env,
            method='DELETE',
            headers={'Authorization': 'Bearer internal-token'},
        )
        with self._patched_request(
            delete_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.service.request',
            ],
        ):
            response = controller.service_detail(service_id)

        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.env['tattoo.service'].sudo().browse(service_id).exists())

    def test_public_lists_hide_inactive_records(self):
        self.artist.active = False
        self.service.active = False
        self.product.active = False
        self.gallery_item.active = False

        artist_request = FakeRequest(self.env, method='GET', params={})
        product_request = FakeRequest(self.env, method='GET', params={})
        service_request = FakeRequest(self.env, method='GET', params={})
        gallery_request = FakeRequest(self.env, method='GET', params={})

        with self._patched_request(
            artist_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.artist.request',
            ],
        ):
            artist_response = TattooArtistController().artists()

        with self._patched_request(
            product_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.product.request',
            ],
        ):
            product_response = TattooProductController().products()

        with self._patched_request(
            service_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.service.request',
            ],
        ):
            service_response = TattooServiceController().services()

        with self._patched_request(
            gallery_request,
            [
                'odoo.addons.tattoo_studio.controllers.api_utils.request',
                'odoo.addons.tattoo_studio.controllers.gallery.request',
            ],
        ):
            gallery_response = TattooGalleryController().gallery()

        self.assertEqual(self._json(artist_response)['data'], [])
        self.assertEqual(self._json(product_response)['data'], [])
        self.assertEqual(self._json(service_response)['data'], [])
        self.assertEqual(self._json(gallery_response)['data'], [])
