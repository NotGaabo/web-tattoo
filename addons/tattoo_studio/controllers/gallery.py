# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request

from .api_utils import TattooApiControllerMixin


class TattooGalleryController(TattooApiControllerMixin, http.Controller):
    def _tattoo_type_label(self, tattoo_type):
        selection = dict(request.env['tattoo.artist.gallery']._fields['tattoo_type'].selection)
        return selection.get(tattoo_type, '')

    def _serialize_gallery(self, gallery):
        return {
            'id': gallery.id,
            'name': gallery.name,
            'artist_id': gallery.artist_id.id,
            'artist_name': gallery.artist_id.name,
            'tattoo_type': gallery.tattoo_type,
            'tattoo_type_label': self._tattoo_type_label(gallery.tattoo_type),
            'description': gallery.description or '',
            'work_date': gallery.work_date.isoformat() if gallery.work_date else '',
            'sequence': gallery.sequence,
            'active': gallery.active,
            'image': f'/web/image/tattoo.artist.gallery/{gallery.id}/image' if gallery.image else '',
        }

    def _build_domain(self, artist_id=None, tattoo_type=None):
        domain = []
        if artist_id:
            domain.append(('artist_id', '=', artist_id))
        if tattoo_type:
            domain.append(('tattoo_type', '=', tattoo_type))
        return domain

    @http.route('/api/gallery', type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def gallery(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        if request.httprequest.method == 'GET':
            internal_user = self._user_from_token(self._extract_token())
            artist_id = request.params.get('artist_id')
            tattoo_type = request.params.get('tattoo_type')
            domain = self._build_domain(
                self._safe_int(artist_id),
                tattoo_type or None,
            )
            if not (internal_user and not internal_user.share):
                domain.append(('active', '=', True))
            pieces = request.env['tattoo.artist.gallery'].sudo().search(domain, order='sequence, id desc')
            return self._response({
                'success': True,
                'data': [self._serialize_gallery(piece) for piece in pieces],
            })

        user, error_response = self._require_internal_user()
        if error_response:
            return error_response

        data = self._json_body()
        name = (data.get('name') or '').strip()
        artist_id = data.get('artist_id')
        tattoo_type = (data.get('tattoo_type') or '').strip()
        image = data.get('image')

        if not name or not artist_id or not tattoo_type or not image:
            return self._response({
                'success': False,
                'message': 'name, artist_id, tattoo_type and image are required',
            }, status=400)

        artist_id_value = self._safe_int(artist_id)
        if not artist_id_value:
            return self._response({
                'success': False,
                'message': 'artist not found',
            }, status=404)

        artist = request.env['tattoo.artist'].sudo().browse(artist_id_value)
        if not artist.exists():
            return self._response({
                'success': False,
                'message': 'artist not found',
            }, status=404)

        gallery = request.env['tattoo.artist.gallery'].sudo().create({
            'name': name,
            'artist_id': artist.id,
            'tattoo_type': tattoo_type,
            'description': (data.get('description') or '').strip(),
            'sequence': int(data.get('sequence') or 10),
            'work_date': data.get('work_date') or False,
            'image': image,
            'active': bool(data.get('active', True)),
        })

        return self._response({
            'success': True,
            'message': 'gallery item created',
            'data': self._serialize_gallery(gallery),
            'created_by': user.id,
        }, status=201)

    @http.route('/api/gallery/<int:gallery_id>', type='http', auth='public', methods=['GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], csrf=False)
    def gallery_detail(self, gallery_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        gallery = request.env['tattoo.artist.gallery'].sudo().browse(gallery_id)
        if not gallery.exists():
            return self._response({
                'success': False,
                'message': 'gallery item not found',
            }, status=404)

        if request.httprequest.method == 'GET':
            internal_user = self._user_from_token(self._extract_token())
            if not gallery.active and not (internal_user and not internal_user.share):
                return self._response({
                    'success': False,
                    'message': 'gallery item not found',
                }, status=404)
            return self._response({
                'success': True,
                'data': self._serialize_gallery(gallery),
            })

        user, error_response = self._require_internal_user()
        if error_response:
            return error_response

        if request.httprequest.method in ('PUT', 'PATCH'):
            data = self._json_body()
            values = {}

            if 'name' in data:
                values['name'] = (data.get('name') or '').strip()
            if 'artist_id' in data:
                artist_id = data.get('artist_id')
                artist_id_value = self._safe_int(artist_id)
                artist = request.env['tattoo.artist'].sudo().browse(artist_id_value) if artist_id_value else False
                if not artist or not artist.exists():
                    return self._response({
                        'success': False,
                        'message': 'artist not found',
                    }, status=404)
                values['artist_id'] = artist.id
            if 'tattoo_type' in data:
                values['tattoo_type'] = (data.get('tattoo_type') or '').strip()
            if 'description' in data:
                values['description'] = (data.get('description') or '').strip()
            if 'work_date' in data:
                values['work_date'] = data.get('work_date') or False
            if 'sequence' in data:
                values['sequence'] = int(data.get('sequence') or 0)
            if 'active' in data:
                values['active'] = bool(data.get('active'))
            if 'image' in data:
                values['image'] = data.get('image') or False

            if not values:
                return self._response({
                    'success': False,
                    'message': 'no fields to update',
                }, status=400)

            gallery.write(values)
            return self._response({
                'success': True,
                'message': 'gallery item updated',
                'data': self._serialize_gallery(gallery),
                'updated_by': user.id,
            })

        gallery.unlink()
        return self._response({
            'success': True,
            'message': 'gallery item deleted',
            'deleted_id': gallery_id,
            'deleted_by': user.id,
        })

    @http.route('/api/artists/<int:artist_id>/gallery', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def artist_gallery(self, artist_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        artist = request.env['tattoo.artist'].sudo().browse(artist_id)
        if not artist.exists():
            return self._response({
                'success': False,
                'message': 'artist not found',
            }, status=404)

        internal_user = self._user_from_token(self._extract_token())
        domain = [('artist_id', '=', artist_id)]
        if not (internal_user and not internal_user.share):
            domain.append(('active', '=', True))

        pieces = request.env['tattoo.artist.gallery'].sudo().search(domain, order='sequence, id desc')
        return self._response({
            'success': True,
            'data': {
                'artist': {
                    'id': artist.id,
                    'name': artist.name,
                },
                'items': [self._serialize_gallery(piece) for piece in pieces],
            },
        })
