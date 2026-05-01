# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request

from .api_utils import TattooApiControllerMixin


class TattooServiceController(TattooApiControllerMixin, http.Controller):
    def _serialize_service(self, service):
        type_labels = {
            'small': 'Pequeño Tatuaje',
            'medium': 'Tatuaje Mediano',
            'large': 'Tatuaje Grande',
        }
        color_labels = {
            'black': 'Negro',
            'color': 'Color',
            'all': 'Todos',
        }

        return {
            'id': service.id,
            'name': service.name,
            'type': service.service_type,
            'typeName': type_labels.get(service.service_type, service.service_type),
            'price': service.base_price,
            'estimatedTime': f'{int(service.estimated_time_hours * 60) if service.estimated_time_hours else 0} min',
            'estimatedTimeHours': service.estimated_time_hours or 0,
            'colors': service.available_colors,
            'colorsName': color_labels.get(service.available_colors, service.available_colors),
            'description': service.description or '',
            'total_appointments': service.total_appointments or 0,
            'average_rating': service.average_rating or 0.0,
            'available_artists': len(service.artist_ids),
            'artist_ids': service.artist_ids.ids,
            'active': service.active,
        }

    @http.route('/api/services', type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def services(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        if request.httprequest.method == 'GET':
            internal_user = self._user_from_token(self._extract_token())
            domain = [] if internal_user and not internal_user.share else [('active', '=', True)]
            services = request.env['tattoo.service'].sudo().search(domain, order='service_type, id')
            return self._response({
                'success': True,
                'data': [self._serialize_service(service) for service in services],
            })

        user, error_response = self._require_internal_user()
        if error_response:
            return error_response

        data = request.httprequest.get_json(silent=True) or {}
        name = (data.get('name') or '').strip()
        service_type = (data.get('type') or '').strip()
        price = data.get('price')

        if not name or not service_type or price is None:
            return self._response({
                'success': False,
                'message': 'name, type and price are required',
            }, status=400)

        service = request.env['tattoo.service'].sudo().create({
            'name': name,
            'service_type': service_type,
            'base_price': float(price),
            'description': (data.get('description') or '').strip(),
            'estimated_time_hours': float(data.get('estimatedTimeHours') or 1.0),
            'available_colors': data.get('colors') or 'black',
            'active': bool(data.get('active', True)),
            'artist_ids': [(6, 0, data.get('artist_ids') or [])],
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
            values = {}

            if 'name' in data:
                values['name'] = (data.get('name') or '').strip()
            if 'type' in data:
                values['service_type'] = (data.get('type') or '').strip()
            if 'price' in data:
                values['base_price'] = float(data.get('price') or 0)
            if 'description' in data:
                values['description'] = (data.get('description') or '').strip()
            if 'estimatedTimeHours' in data:
                values['estimated_time_hours'] = float(data.get('estimatedTimeHours') or 0)
            if 'colors' in data:
                values['available_colors'] = (data.get('colors') or '').strip()
            if 'active' in data:
                values['active'] = bool(data.get('active'))
            if 'artist_ids' in data:
                values['artist_ids'] = [(6, 0, data.get('artist_ids') or [])]

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
