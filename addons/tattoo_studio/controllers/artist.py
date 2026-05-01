# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request

from .api_utils import TattooApiControllerMixin


class TattooArtistController(TattooApiControllerMixin, http.Controller):
    def _serialize_artist(self, artist):
        return {
            'id': artist.id,
            'name': artist.name,
            'email': artist.email or '',
            'phone': artist.phone or '',
            'specialization': artist.specialization or '',
            'biography': artist.biography or '',
            'years_of_experience': artist.years_of_experience or 0,
            'rating': artist.average_rating or 0.0,
            'reviewCount': artist.total_reviews or 0,
            'total_completed_appointments': artist.total_completed_appointments or 0,
            'is_available': artist.is_available,
            'active': artist.active,
            'image': f'/web/image/tattoo.artist/{artist.id}/image_1920' if artist.image_1920 else '',
            'skills': [skill.name for skill in artist.skill_ids],
            'skill_ids': artist.skill_ids.ids,
            'services': [service.name for service in artist.service_ids],
            'service_ids': artist.service_ids.ids,
            'portfolio': [
                {
                    'id': img.id,
                    'url': img.image_url or '',
                    'title': img.name or '',
                    'type': img.tattoo_type or '',
                    'description': img.description or '',
                } for img in artist.portfolio_image_ids
            ],
            'gallery': [
                {
                    'id': image.id,
                    'name': image.name or '',
                    'type': image.tattoo_type or '',
                    'description': image.description or '',
                    'url': image.image_url or '',
                    'work_date': image.work_date.isoformat() if image.work_date else '',
                    'active': image.active,
                } for image in artist.gallery_image_ids
            ],
        }

    @http.route('/api/artists', type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def artists(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        if request.httprequest.method == 'GET':
            internal_user = self._user_from_token(self._extract_token())
            domain = [] if internal_user and not internal_user.share else [('active', '=', True)]
            artists = request.env['tattoo.artist'].sudo().search(domain, order='id desc')
            return self._response({
                'success': True,
                'data': [self._serialize_artist(artist) for artist in artists],
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

        artist = request.env['tattoo.artist'].sudo().create({
            'name': name,
            'email': (data.get('email') or '').strip(),
            'phone': (data.get('phone') or '').strip(),
            'specialization': (data.get('specialization') or '').strip(),
            'biography': data.get('biography') or '',
            'years_of_experience': int(data.get('years_of_experience') or 0),
            'is_available': bool(data.get('is_available', True)),
            'active': bool(data.get('active', True)),
            'skill_ids': [(6, 0, data.get('skill_ids') or [])],
            'service_ids': [(6, 0, data.get('service_ids') or [])],
        })

        if data.get('image'):
            artist.sudo().write({'image_1920': data.get('image')})

        return self._response({
            'success': True,
            'message': 'artist created',
            'data': self._serialize_artist(artist),
            'created_by': user.id,
        }, status=201)

    @http.route('/api/artists/<int:artist_id>', type='http', auth='public', methods=['GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], csrf=False)
    def artist_detail(self, artist_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        artist = request.env['tattoo.artist'].sudo().browse(artist_id)
        if not artist.exists():
            return self._response({
                'success': False,
                'message': 'artist not found',
            }, status=404)

        if request.httprequest.method == 'GET':
            internal_user = self._user_from_token(self._extract_token())
            if not artist.active and not (internal_user and not internal_user.share):
                return self._response({
                    'success': False,
                    'message': 'artist not found',
                }, status=404)
            return self._response({
                'success': True,
                'data': self._serialize_artist(artist),
            })

        user, error_response = self._require_internal_user()
        if error_response:
            return error_response

        if request.httprequest.method in ('PUT', 'PATCH'):
            data = self._json_body()
            values = {}

            if 'name' in data:
                values['name'] = (data.get('name') or '').strip()
            if 'email' in data:
                values['email'] = (data.get('email') or '').strip()
            if 'phone' in data:
                values['phone'] = (data.get('phone') or '').strip()
            if 'specialization' in data:
                values['specialization'] = (data.get('specialization') or '').strip()
            if 'biography' in data:
                values['biography'] = data.get('biography') or ''
            if 'years_of_experience' in data:
                values['years_of_experience'] = int(data.get('years_of_experience') or 0)
            if 'is_available' in data:
                values['is_available'] = bool(data.get('is_available'))
            if 'active' in data:
                values['active'] = bool(data.get('active'))
            if 'skill_ids' in data:
                values['skill_ids'] = [(6, 0, data.get('skill_ids') or [])]
            if 'service_ids' in data:
                values['service_ids'] = [(6, 0, data.get('service_ids') or [])]
            if 'image' in data:
                values['image_1920'] = data.get('image') or False

            if not values:
                return self._response({
                    'success': False,
                    'message': 'no fields to update',
                }, status=400)

            artist.write(values)
            return self._response({
                'success': True,
                'message': 'artist updated',
                'data': self._serialize_artist(artist),
                'updated_by': user.id,
            })

        artist.unlink()
        return self._response({
            'success': True,
            'message': 'artist deleted',
            'deleted_id': artist_id,
            'deleted_by': user.id,
        })
