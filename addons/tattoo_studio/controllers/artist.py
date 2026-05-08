# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request

from .api_utils import TattooApiControllerMixin


class TattooArtistController(TattooApiControllerMixin, http.Controller):
    def _skill_commands_from_payload(self, data):
        commands = []
        ids = data.get('skill_ids') or []
        names = data.get('skills') or []

        if ids:
            commands.extend(int(skill_id) for skill_id in ids if skill_id)

        if isinstance(names, str):
            names = [item.strip() for item in names.split(',') if item.strip()]

        if names:
            skill_model = request.env['tattoo.skill'].sudo()
            for raw_name in names:
                skill_name = (raw_name or '').strip()
                if not skill_name:
                    continue
                existing = skill_model.search([('name', '=ilike', skill_name)], limit=1)
                if not existing:
                    existing = skill_model.create({'name': skill_name})
                commands.append(existing.id)

        unique_ids = list(dict.fromkeys(commands))
        return [(6, 0, unique_ids)], unique_ids

    def _specialization_from_payload(self, data, skill_ids):
        if skill_ids:
            skills = request.env['tattoo.skill'].sudo().browse(skill_ids).mapped('name')
            return ', '.join(skills[:3])
        return (data.get('specialization') or '').strip()

    def _serialize_artist(self, artist):
        return {
            'id': artist.id,
            'name': artist.name,
            'email': artist.email or '',
            'phone': artist.phone or '',
            'social_handle': artist.social_handle or '',
            'specialization': artist.specialization or '',
            'biography': artist.biography or '',
            'rating': artist.average_rating or 0.0,
            'reviewCount': artist.total_reviews or 0,
            'total_completed_appointments': artist.total_completed_appointments or 0,
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

        skill_commands, skill_ids = self._skill_commands_from_payload(data)

        artist = request.env['tattoo.artist'].sudo().create({
            'name': name,
            'email': (data.get('email') or '').strip(),
            'phone': (data.get('phone') or '').strip(),
            'social_handle': (data.get('social_handle') or '').strip(),
            'specialization': self._specialization_from_payload(data, skill_ids),
            'biography': data.get('biography') or '',
            'skill_ids': skill_commands,
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
            resolved_skill_ids = None

            if 'name' in data:
                values['name'] = (data.get('name') or '').strip()
            if 'email' in data:
                values['email'] = (data.get('email') or '').strip()
            if 'phone' in data:
                values['phone'] = (data.get('phone') or '').strip()
            if 'social_handle' in data:
                values['social_handle'] = (data.get('social_handle') or '').strip()
            if 'specialization' in data and 'skills' not in data and 'skill_ids' not in data:
                values['specialization'] = (data.get('specialization') or '').strip()
            if 'biography' in data:
                values['biography'] = data.get('biography') or ''
            if 'skill_ids' in data or 'skills' in data:
                values['skill_ids'], resolved_skill_ids = self._skill_commands_from_payload(data)
                values['specialization'] = self._specialization_from_payload(data, resolved_skill_ids)
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
