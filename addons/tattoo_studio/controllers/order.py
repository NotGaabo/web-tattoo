# -*- coding: utf-8 -*-

from urllib.parse import quote

from odoo import http
from odoo.exceptions import ValidationError
from odoo.http import request

from .api_utils import TattooApiControllerMixin


class TattooOrderController(TattooApiControllerMixin, http.Controller):
    _whatsapp_number = '18494606390'

    def _get_or_create_customer(self, user):
        customer_model = request.env['tattoo.customer'].sudo()
        partner = user.partner_id.sudo()
        email = (partner.email or user.login or '').strip().lower()

        customer = customer_model.search([('email', '=', email or user.login)], limit=1)
        values = {
            'name': (partner.name or user.name or user.login or '').strip() or user.login,
            'email': email or user.login,
            'phone': (partner.phone or '').strip(),
        }

        if customer:
            customer.write(values)
            return customer
        return customer_model.create(values)

    def _serialize_order(self, order):
        return {
            'id': order.id,
            'order_number': order.order_number,
            'state': order.state,
            'payment_method': order.payment_method,
            'payment_state': order.payment_state,
            'delivery_state': order.delivery_state,
            'total_quantity': order.total_quantity,
            'subtotal': order.subtotal,
            'tax_amount': order.tax_amount,
            'total_amount': order.total_amount,
            'order_date': order.order_date,
            'delivery_address': order.delivery_address or '',
            'notes': order.notes or '',
            'stock_reserved': bool(order.stock_reserved),
            'stock_committed': bool(order.stock_committed),
            'customer': {
                'id': order.customer_id.id,
                'name': order.customer_id.name or '',
                'email': order.customer_id.email or '',
                'phone': order.customer_id.phone or '',
            },
            'items': [
                {
                    'product_id': line.product_id.id,
                    'product_name': line.product_id.name,
                    'quantity': line.quantity,
                    'unit_price': line.unit_price,
                    'subtotal': line.subtotal,
                }
                for line in order.order_line_ids
            ],
        }

    def _build_whatsapp_message(self, order):
        lines = [
            'Hola, quiero confirmar esta orden.',
            '',
            f'Cliente: {order.customer_id.name or "Cliente"}',
            f'Orden: {order.order_number}',
            'Productos:',
        ]

        for item in order.order_line_ids:
            lines.append(
                f'- {item.product_id.name} x{int(item.quantity)} - ${float(item.subtotal or 0):.2f}'
            )

        lines.extend([
            '',
            f'Total: ${float(order.total_amount or 0):.2f}',
        ])

        if order.notes:
            lines.extend(['', f'Notas: {order.notes}'])

        return '\n'.join(lines)

    def _build_whatsapp_url(self, message):
        return f'https://wa.me/{self._whatsapp_number}?text={quote(message or "")}'

    @http.route('/api/orders', type='http', auth='public', methods=['POST', 'GET', 'OPTIONS'], csrf=False)
    def orders(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        scope = (request.params.get('scope') or '').strip().lower()
        if request.httprequest.method == 'GET' and scope == 'all':
            user, error_response = self._require_internal_user()
        else:
            user, error_response = self._require_user()
        if error_response:
            return error_response

        if request.httprequest.method == 'GET' and scope == 'all':
            orders = request.env['tattoo.order'].sudo().search([], order='order_date desc')
            return self._response({
                'success': True,
                'data': [self._serialize_order(order) for order in orders],
            })

        customer = self._get_or_create_customer(user)

        if request.httprequest.method == 'GET':
            orders = request.env['tattoo.order'].sudo().search([
                ('customer_id', '=', customer.id),
            ], order='order_date desc')
            return self._response({
                'success': True,
                'data': [self._serialize_order(order) for order in orders],
            })

        data = self._json_body()
        items = data.get('items') or []
        notes = (data.get('notes') or '').strip()

        if not items:
            return self._response({
                'success': False,
                'message': 'order items are required',
            }, status=400)

        prepared_lines = []
        for raw_item in items:
            product_id = self._safe_int(raw_item.get('id') or raw_item.get('product_id'))
            quantity = int(raw_item.get('quantity') or 0)
            product = request.env['product.template'].sudo().browse(product_id)

            if not product_id or not product.exists() or not product.active:
                return self._response({
                    'success': False,
                    'message': 'One of the selected products is no longer available.',
                }, status=400)

            if quantity <= 0:
                return self._response({
                    'success': False,
                    'message': f'Invalid quantity for {product.name}.',
                }, status=400)

            sellable_quantity = max((product.quantity_available or 0.0) - (product.quantity_reserved or 0.0), 0.0)
            if quantity > sellable_quantity:
                return self._response({
                    'success': False,
                    'message': f'Only {int(sellable_quantity)} unit(s) of {product.name} are available.',
                }, status=400)

            prepared_lines.append((product, quantity))

        order_lines = [
            (0, 0, {
                'product_id': product.id,
                'quantity': quantity,
            })
            for product, quantity in prepared_lines
        ]

        try:
            order = request.env['tattoo.order'].sudo().create({
                'customer_id': customer.id,
                'delivery_address': '',
                'payment_method': 'other',
                'payment_state': 'not_paid',
                'state': 'draft',
                'notes': notes,
                'user_id': user.id,
                'order_line_ids': order_lines,
            })
            order.action_reserve_stock()
        except ValidationError as error:
            return self._response({
                'success': False,
                'message': error.args[0] if error.args else 'Order validation failed.',
            }, status=400)

        whatsapp_message = self._build_whatsapp_message(order)

        return self._response({
            'success': True,
            'message': 'order created',
            'data': self._serialize_order(order),
            'whatsapp_message': whatsapp_message,
            'whatsapp_url': self._build_whatsapp_url(whatsapp_message),
        }, status=201)

    @http.route('/api/orders/<int:order_id>', type='http', auth='public', methods=['GET', 'PATCH', 'PUT', 'OPTIONS'], csrf=False)
    def order_detail(self, order_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        scope = (request.params.get('scope') or '').strip().lower()
        if request.httprequest.method in ('PATCH', 'PUT') or scope == 'all':
            user, error_response = self._require_internal_user()
        else:
            user, error_response = self._require_user()
        if error_response:
            return error_response

        order = request.env['tattoo.order'].sudo().browse(order_id)
        if not order.exists():
            return self._response({
                'success': False,
                'message': 'order not found',
            }, status=404)

        if request.httprequest.method == 'GET' and scope == 'all':
            return self._response({
                'success': True,
                'data': self._serialize_order(order),
            })

        if request.httprequest.method == 'GET':
            customer = self._get_or_create_customer(user)
            if order.customer_id.id != customer.id:
                return self._response({
                    'success': False,
                    'message': 'order not found',
                }, status=404)

            return self._response({
                'success': True,
                'data': self._serialize_order(order),
            })

        data = self._json_body()
        action = (data.get('action') or '').strip().lower()
        notes = (data.get('notes') or '').strip()
        if notes:
            order.sudo().write({'notes': notes})

        actions = {
            'accept': order.action_accept,
            'confirm': order.action_confirm,
            'process': order.action_process,
            'ship': order.action_ship,
            'deliver': order.action_deliver,
            'complete': order.action_complete,
            'cancel': order.action_cancel,
        }
        if action not in actions:
            return self._response({
                'success': False,
                'message': 'invalid order action',
            }, status=400)

        try:
            actions[action]()
        except ValidationError as error:
            return self._response({
                'success': False,
                'message': error.args[0] if error.args else 'Order validation failed.',
            }, status=400)

        action_messages = {
            'accept': 'order accepted',
            'confirm': 'order confirmed',
            'process': 'order processed',
            'ship': 'order shipped',
            'deliver': 'order delivered',
            'complete': 'order completed',
            'cancel': 'order cancelled',
        }

        return self._response({
            'success': True,
            'message': action_messages[action],
            'data': self._serialize_order(order),
        })
