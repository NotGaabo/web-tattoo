# -*- coding: utf-8 -*-

import json

from odoo import http
from odoo.http import request
from werkzeug.wrappers import Response


class TattooProductController(http.Controller):
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
            ('api_token', '=', token)
        ], limit=1)

    def _require_user(self):
        user = self._user_from_token(self._extract_token())
        if not user:
            return False, self._response({
                'success': False,
                'message': 'unauthorized',
            }, status=401)
        return user, None

    def _require_internal_user(self):
        user, error_response = self._require_user()
        if error_response:
            return False, error_response
        if user.share:
            return False, self._response({
                'success': False,
                'message': 'forbidden',
            }, status=403)
        return user, None

    def _serialize_product(self, product):
        return {
            'id': product.id,
            'name': product.name,
            'price': product.list_price,
            'description': product.description_sale or '',
            'active': product.active,
            'brand': product.brand or '',
            'image': f'/web/image/product.template/{product.id}/image_1920' if product.image_1920 else '',
        }

    @http.route('/api/products', type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def products(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        if request.httprequest.method == 'GET':
            products = request.env['product.template'].sudo().search([], order='id desc')
            return self._response({
                'success': True,
                'data': [self._serialize_product(product) for product in products],
            })

        user, error_response = self._require_internal_user()
        if error_response:
            return error_response

        data = self._json_body()
        name = (data.get('name') or '').strip()
        price = data.get('price')
        description = (data.get('description') or '').strip()

        if not name or price is None:
            return self._response({
                'success': False,
                'message': 'name and price are required',
            }, status=400)

        product = request.env['product.template'].sudo().create({
            'name': name,
            'list_price': float(price),
            'description_sale': description,
        })

        if data.get('image'):
            product.sudo().write({'image_1920': data.get('image')})

        return self._response({
            'success': True,
            'message': 'product created',
            'data': self._serialize_product(product),
            'created_by': user.id,
        }, status=201)

    @http.route('/api/products/<int:product_id>', type='http', auth='public', methods=['GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], csrf=False)
    def product_detail(self, product_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        product = request.env['product.template'].sudo().browse(product_id)
        if not product.exists():
            return self._response({
                'success': False,
                'message': 'product not found',
            }, status=404)

        if request.httprequest.method == 'GET':
            return self._response({
                'success': True,
                'data': self._serialize_product(product),
            })

        user, error_response = self._require_internal_user()
        if error_response:
            return error_response

        if request.httprequest.method in ('PUT', 'PATCH'):
            data = self._json_body()
            values = {}
            if 'name' in data:
                values['name'] = (data.get('name') or '').strip()
            if 'price' in data:
                values['list_price'] = float(data.get('price') or 0)
            if 'description' in data:
                values['description_sale'] = (data.get('description') or '').strip()
            if 'active' in data:
                values['active'] = bool(data.get('active'))
            if 'image' in data:
                values['image_1920'] = data.get('image') or False

            if not values:
                return self._response({
                    'success': False,
                    'message': 'no fields to update',
                }, status=400)

            product.write(values)
            return self._response({
                'success': True,
                'message': 'product updated',
                'data': self._serialize_product(product),
                'updated_by': user.id,
            })

        product.unlink()
        return self._response({
            'success': True,
            'message': 'product deleted',
            'deleted_id': product_id,
            'deleted_by': user.id,
        })
