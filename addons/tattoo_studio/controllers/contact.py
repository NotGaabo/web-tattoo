# -*- coding: utf-8 -*-

from urllib.parse import quote

from odoo import http
from odoo.http import request

from .api_utils import TattooApiControllerMixin


class TattooContactController(TattooApiControllerMixin, http.Controller):
    _whatsapp_number = '18494606390'

    def _get_or_create_customer(self, user):
        Customer = request.env['tattoo.customer'].sudo()
        partner = user.partner_id.sudo()
        customer_email = (partner.email or user.login or '').strip().lower()
        customer = Customer.search([('email', '=', customer_email or user.login)], limit=1)

        values = {
            'name': (partner.name or user.name or user.login or '').strip() or user.login,
            'email': customer_email or user.login,
            'phone': (partner.phone or '').strip(),
        }

        if customer:
            customer.write(values)
            return customer
        return Customer.create(values)

    def _serialize_request(self, contact_request):
        return {
            'id': contact_request.id,
            'name': contact_request.name,
            'customer_id': contact_request.customer_id.id,
            'customer_name': contact_request.customer_id.name,
            'subject': contact_request.subject,
            'message': contact_request.message,
            'state': contact_request.state,
            'whatsapp_message': contact_request.whatsapp_message or '',
            'whatsapp_url': f'https://wa.me/{self._whatsapp_number}?text={quote(contact_request.whatsapp_message or "")}',
        }

    @http.route('/api/contact-requests', type='http', auth='public', methods=['POST', 'GET', 'OPTIONS'], csrf=False)
    def contact_requests(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        user, error_response = self._require_user()
        if error_response:
            return error_response

        if request.httprequest.method == 'GET':
            customer = self._get_or_create_customer(user)
            records = request.env['tattoo.contact.request'].sudo().search([
                ('customer_id', '=', customer.id),
            ], order='create_date desc')
            return self._response({
                'success': True,
                'data': [self._serialize_request(record) for record in records],
            })

        data = self._json_body()
        subject = (data.get('subject') or '').strip()
        message = (data.get('message') or '').strip()
        if not subject or not message:
            return self._response({
                'success': False,
                'message': 'subject and message are required',
            }, status=400)

        customer = self._get_or_create_customer(user)
        whatsapp_message = '\n'.join([
            'Hola, quiero hacer una consulta desde la web.',
            '',
            f'Cliente: {customer.name}',
            f'Asunto: {subject}',
            '',
            'Mensaje:',
            message,
        ])

        record = request.env['tattoo.contact.request'].sudo().create({
            'customer_id': customer.id,
            'user_id': user.id,
            'subject': subject,
            'message': message,
            'whatsapp_message': whatsapp_message,
        })

        return self._response({
            'success': True,
            'data': self._serialize_request(record),
            'whatsapp_url': f'https://wa.me/{self._whatsapp_number}?text={quote(whatsapp_message)}',
        }, status=201)
