# -*- coding: utf-8 -*-

import json

from odoo import http
from odoo.http import request
from werkzeug.wrappers import Response


class TattooGalleryController(http.Controller):
    _cors_headers = [
        ('Content-Type', 'application/json'),
        ('Access-Control-Allow-Origin', '*'),
        ('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
        ('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'),
    ]

    def _response(self, payload, status=200):
        body = json.dumps(payload, default=str)
        response = Response(body, status=status, content_type='application/json')
        for header, value in self._cors_headers:
            response.headers[header] = value
        return response

    def _preflight(self):
        return self._response({'success': True}, status=200)

    def _json_body(self):
        return request.httprequest.get_json(silent=True) or {}

    def _extract_token(self):
        auth_header = request.httprequest.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            return auth_header.split(' ', 1)[1].strip()
        return request.httprequest.headers.get('X-API-Token', '').strip()

    def _user_from_token(self, token):
        if not token:
            return False
        return request.env['res.users'].sudo().search([
            ('api_token', '=', token),
        ], limit=1)

    def _require_internal_user(self):
        user = self._user_from_token(self._extract_token())
        if not user:
            return False, self._response({
                'success': False,
                'message': 'unauthorized',
            }, status=401)
        if user.share:
            return False, self._response({
                'success': False,
                'message': 'forbidden',
            }, status=403)
        return user, None

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

    def _safe_int(self, value, default=None):
        try:
            return int(value)
        except (TypeError, ValueError):
            return default

    @http.route('/api/gallery', type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def gallery(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        if request.httprequest.method == 'GET':
            artist_id = request.params.get('artist_id')
            tattoo_type = request.params.get('tattoo_type')
            domain = self._build_domain(
                self._safe_int(artist_id),
                tattoo_type or None,
            )
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

        pieces = request.env['tattoo.artist.gallery'].sudo().search([
            ('artist_id', '=', artist_id),
        ], order='sequence, id desc')
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
