# -*- coding: utf-8 -*-

import json

from odoo import http
from odoo.http import request
from werkzeug.wrappers import Response


class TattooServiceController(http.Controller):
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

    def _serialize_service(self, service):
        # Map service type to readable names
        type_labels = {
            'small': 'Pequeño Tatuaje',
            'medium': 'Tatuaje Mediano',
            'large': 'Tatuaje Grande'
        }
        
        color_labels = {
            'black': 'Negro',
            'color': 'Color',
            'all': 'Todos'
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
            'active': service.active,
        }

    @http.route('/api/services', type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def services(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        if request.httprequest.method == 'GET':
            services = request.env['tattoo.service'].sudo().search([('active', '=', True)], order='service_type, id')
            return self._response({
                'success': True,
                'data': [self._serialize_service(service) for service in services],
            })

        # POST - requires authentication
        auth_header = request.httprequest.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return self._response({
                'success': False,
                'message': 'unauthorized',
            }, status=401)

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
            'estimated_time_hours': data.get('estimatedTimeHours') or 1.0,
            'available_colors': data.get('colors') or 'black',
        })

        return self._response({
            'success': True,
            'message': 'service created',
            'data': self._serialize_service(service),
        }, status=201)

    @http.route('/api/services/<int:service_id>', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def service_detail(self, service_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        service = request.env['tattoo.service'].sudo().browse(service_id)
        if not service.exists():
            return self._response({
                'success': False,
                'message': 'service not found',
            }, status=404)

        return self._response({
            'success': True,
            'data': self._serialize_service(service),
        })
