# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request

from .api_utils import TattooApiControllerMixin


class TattooServiceController(TattooApiControllerMixin, http.Controller):
    _allowed_write_fields = {'name', 'description', 'active'}
    _deprecated_fields = {
        'type': 'Los servicios ya no manejan tipo.',
        'price': 'Los servicios se cotizan por WhatsApp, sin precio fijo.',
        'estimatedTimeHours': 'Los servicios ya no guardan tiempo estimado por registro.',
        'colors': 'Los servicios ya no guardan colores por registro.',
        'artist_ids': 'Los servicios ya no se asignan a tatuadores especificos.',
    }

    def _serialize_service(self, service):
        return {
            'id': service.id,
            'name': service.name,
            'description': service.description or '',
            'total_appointments': service.total_appointments or 0,
            'average_rating': service.average_rating or 0.0,
            'active': service.active,
        }

    def _validate_service_payload(self, data, require_name=False):
        invalid = [field for field in data.keys() if field not in self._allowed_write_fields]
        if invalid:
            field = invalid[0]
            message = self._deprecated_fields.get(field, f'Campo no permitido: {field}')
            return self._response({
                'success': False,
                'message': message,
            }, status=400)

        if require_name and not (data.get('name') or '').strip():
            return self._response({
                'success': False,
                'message': 'name is required',
            }, status=400)

        if 'name' in data and not (data.get('name') or '').strip():
            return self._response({
                'success': False,
                'message': 'name cannot be empty',
            }, status=400)

        return None

    @http.route('/api/services', type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def services(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        if request.httprequest.method == 'GET':
            internal_user = self._user_from_token(self._extract_token())
            domain = [] if internal_user and not internal_user.share else [('active', '=', True)]
            services = request.env['tattoo.service'].sudo().search(domain, order='name, id')
            return self._response({
                'success': True,
                'data': [self._serialize_service(service) for service in services],
            })

        user, error_response = self._require_internal_user()
        if error_response:
            return error_response

        data = request.httprequest.get_json(silent=True) or {}
        validation_error = self._validate_service_payload(data, require_name=True)
        if validation_error:
            return validation_error

        service = request.env['tattoo.service'].sudo().create({
            'name': (data.get('name') or '').strip(),
            'description': (data.get('description') or '').strip(),
            'active': bool(data.get('active', True)),
        })

        return self._response({
            'success': True,
            'message': 'service created',
            'data': self._serialize_service(service),
            'created_by': user.id,
        }, status=201)

    @http.route('/api/services/<int:service_id>', type='http', auth='public', methods=['GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], csrf=False)
    def service_detail(self, service_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        service = request.env['tattoo.service'].sudo().browse(service_id)
        if not service.exists():
            return self._response({
                'success': False,
                'message': 'service not found',
            }, status=404)

        if request.httprequest.method == 'GET':
            internal_user = self._user_from_token(self._extract_token())
            if not service.active and not (internal_user and not internal_user.share):
                return self._response({
                    'success': False,
                    'message': 'service not found',
                }, status=404)
            return self._response({
                'success': True,
                'data': self._serialize_service(service),
            })

        user, error_response = self._require_internal_user()
        if error_response:
            return error_response

        if request.httprequest.method in ('PUT', 'PATCH'):
            data = request.httprequest.get_json(silent=True) or {}
            validation_error = self._validate_service_payload(data)
            if validation_error:
                return validation_error
            values = {}

            if 'name' in data:
                values['name'] = (data.get('name') or '').strip()
            if 'description' in data:
                values['description'] = (data.get('description') or '').strip()
            if 'active' in data:
                values['active'] = bool(data.get('active'))

            if not values:
                return self._response({
                    'success': False,
                    'message': 'no fields to update',
                }, status=400)

            service.write(values)
            return self._response({
                'success': True,
                'message': 'service updated',
                'data': self._serialize_service(service),
                'updated_by': user.id,
            })

        service.unlink()
        return self._response({
            'success': True,
            'message': 'service deleted',
            'deleted_id': service_id,
            'deleted_by': user.id,
        })
