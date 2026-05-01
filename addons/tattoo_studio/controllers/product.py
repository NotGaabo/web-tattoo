# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request

from .api_utils import TattooApiControllerMixin


class TattooProductController(TattooApiControllerMixin, http.Controller):
    def _serialize_product(self, product):
        return {
            'id': product.id,
            'name': product.name,
            'code': product.code or '',
            'brand': product.brand or '',
            'price': product.list_price,
            'cost_price': product.cost_price or product.standard_price or 0.0,
            'description': product.description_sale or '',
            'active': product.active,
            'quantity_available': product.quantity_available or 0.0,
            'quantity_reserved': product.quantity_reserved or 0.0,
            'average_rating': product.average_rating or 0.0,
            'total_reviews': product.total_reviews or 0,
            'total_sales': product.total_sales or 0.0,
            'image': f'/web/image/product.template/{product.id}/image_1920' if product.image_1920 else '',
        }

    @http.route('/api/products', type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def products(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        if request.httprequest.method == 'GET':
            internal_user = self._user_from_token(self._extract_token())
            domain = [] if internal_user and not internal_user.share else [('active', '=', True)]
            products = request.env['product.template'].sudo().search(domain, order='id desc')
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
            'code': (data.get('code') or '').strip(),
            'brand': (data.get('brand') or '').strip(),
            'standard_price': float(data.get('cost_price') or 0),
            'active': bool(data.get('active', True)),
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
            internal_user = self._user_from_token(self._extract_token())
            if not product.active and not (internal_user and not internal_user.share):
                return self._response({
                    'success': False,
                    'message': 'product not found',
                }, status=404)
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
            if 'code' in data:
                values['code'] = (data.get('code') or '').strip()
            if 'brand' in data:
                values['brand'] = (data.get('brand') or '').strip()
            if 'price' in data:
                values['list_price'] = float(data.get('price') or 0)
            if 'cost_price' in data:
                values['standard_price'] = float(data.get('cost_price') or 0)
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
