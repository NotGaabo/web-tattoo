# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request

from .api_utils import TattooApiControllerMixin


class TattooProductBrandController(TattooApiControllerMixin, http.Controller):
    def _serialize_brand(self, brand):
        return {
            'id': brand.id,
            'name': brand.name,
            'active': brand.active,
            'product_count': brand.product_count,
        }

    @http.route('/api/product-brands', type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def product_brands(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        if request.httprequest.method == 'GET':
            internal_user = self._user_from_token(self._extract_token())
            domain = [] if internal_user and not internal_user.share else [('active', '=', True)]
            brands = request.env['tattoo.product.brand'].sudo().search(domain, order='name')
            return self._response({
                'success': True,
                'data': [self._serialize_brand(brand) for brand in brands],
            })

        user, error_response = self._require_internal_user()
        if error_response:
            return error_response

        data = self._json_body()
        name = (data.get('name') or '').strip()
        if not name:
            return self._response({
                'success': False,
                'message': 'name is required',
            }, status=400)

        brand = request.env['tattoo.product.brand'].sudo().create({
            'name': name,
            'active': bool(data.get('active', True)),
        })

        return self._response({
            'success': True,
            'message': 'brand created',
            'data': self._serialize_brand(brand),
            'created_by': user.id,
        }, status=201)

    @http.route('/api/product-brands/<int:brand_id>', type='http', auth='public', methods=['PUT', 'PATCH', 'DELETE', 'OPTIONS'], csrf=False)
    def product_brand_detail(self, brand_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        brand = request.env['tattoo.product.brand'].sudo().browse(brand_id)
        if not brand.exists():
            return self._response({
                'success': False,
                'message': 'brand not found',
            }, status=404)

        user, error_response = self._require_internal_user()
        if error_response:
            return error_response

        if request.httprequest.method in ('PUT', 'PATCH'):
            data = self._json_body()
            values = {}
            if 'name' in data:
                values['name'] = (data.get('name') or '').strip()
            if 'active' in data:
                values['active'] = bool(data.get('active'))

            if not values:
                return self._response({
                    'success': False,
                    'message': 'no fields to update',
                }, status=400)

            brand.write(values)
            return self._response({
                'success': True,
                'message': 'brand updated',
                'data': self._serialize_brand(brand),
                'updated_by': user.id,
            })

        if brand.product_count:
            brand.write({'active': False})
            return self._response({
                'success': True,
                'message': 'brand archived because it is linked to products',
                'data': self._serialize_brand(brand),
                'updated_by': user.id,
            })

        brand.unlink()
        return self._response({
            'success': True,
            'message': 'brand deleted',
            'deleted_id': brand_id,
            'deleted_by': user.id,
        })
