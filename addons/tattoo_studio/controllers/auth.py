# -*- coding: utf-8 -*-

import json
from uuid import uuid4

from odoo import http, fields
from odoo.exceptions import AccessDenied
from odoo.http import request
from werkzeug.wrappers import Response


class TattooAuthController(http.Controller):
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

    def _generate_token(self):
        return uuid4().hex

    def _get_user_role(self, user):
        if user.share:
            return 'portal'
        if user.has_group('base.group_system'):
            return 'admin'
        return 'internal'

    def _serialize_user(self, user):
        role = self._get_user_role(user)
        return {
            'id': user.id,
            'name': user.name,
            'email': user.login,
            'phone': user.partner_id.phone or '',
            'token': user.api_token,
            'role': role,
            'user_type': 'portal' if role == 'portal' else 'internal',
            'is_admin': role == 'admin',
            'is_portal': role == 'portal',
        }

    def _ensure_customer_for_user(self, user, name=None, email=None, phone=None):
        if not user or not user.share:
            return False

        Customer = request.env['tattoo.customer'].sudo()
        partner = user.partner_id.sudo()
        customer_name = (name or partner.name or user.name or '').strip()
        customer_email = (email or partner.email or user.login or '').strip().lower()
        customer_phone = (phone or partner.phone or '').strip()

        domain = [('user_id', '=', user.id)]
        if customer_email:
            domain = ['|', ('user_id', '=', user.id), ('email', '=', customer_email)]

        customer = Customer.search(domain, limit=1)
        customer_vals = {
            'name': customer_name or user.name or user.login,
            'email': customer_email or user.login,
            'phone': customer_phone,
            'user_id': user.id,
        }

        if customer:
            customer.write(customer_vals)
            return customer

        return Customer.create(customer_vals)

    @http.route('/api/auth/register', type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False)
    def register(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        data = self._json_body()
        name = (data.get('name') or '').strip()
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''
        phone = (data.get('phone') or '').strip()

        if not name or not email or not password:
            return self._response({
                'success': False,
                'message': 'name, email and password are required',
            }, status=400)

        Users = request.env['res.users'].sudo()
        if Users.search_count([('login', '=', email)]):
            return self._response({
                'success': False,
                'message': 'email already registered',
            }, status=409)

        user_vals = {
            'name': name,
            'login': email,
            'password': password,
            'api_token': self._generate_token(),
        }

        user = Users.create(user_vals)
        user.sudo().write({'share': True})
        partner_values = {'email': email}
        if phone:
            partner_values['phone'] = phone
        user.partner_id.sudo().write(partner_values)
        self._ensure_customer_for_user(user, name=name, email=email, phone=phone)

        return self._response({
            'success': True,
            'message': 'account created',
            'data': self._serialize_user(user),
        }, status=201)

    @http.route('/api/auth/signin', type='http', auth='none', methods=['POST', 'OPTIONS'], csrf=False)
    def signin(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        # Try multiple ways to get the data
        data = self._json_body()
        if not data:
            data = request.httprequest.get_json() or {}
        if not data:
            data = kwargs
        
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''

        if not email or not password:
            return self._response({
                'success': False,
                'message': 'email and password are required: got %s' % str(data),
            }, status=400)

        # Find user and check credentials
        Users = request.env['res.users'].sudo()
        user = Users.search([('login', '=', email)], limit=1)
        if not user:
            return self._response({
                'success': False,
                'message': 'user not found',
            }, status=401)

        # Check password
        try:
            user.with_user(user)._check_credentials({
                'type': 'password',
                'password': password,
            }, {'interactive': True})
        except Exception as e:
            return self._response({
                'success': False,
                'message': 'invalid credentials: %s' % str(e),
            }, status=401)

        token = self._generate_token()
        user.write({
            'api_token': token,
        })

        self._ensure_customer_for_user(
            user,
            name=user.partner_id.name or user.name,
            email=user.partner_id.email or user.login,
            phone=user.partner_id.phone or '',
        )

        return self._response({
            'success': True,
            'message': 'login successful',
            'data': {
                **self._serialize_user(user),
                'token': token,
                'login_date': fields.Datetime.now(),
            }
        })

    # Alias for signin
    @http.route('/api/auth/login', type='http', auth='none', methods=['POST', 'OPTIONS'], csrf=False)
    def login(self, **kwargs):
        return self.signin(**kwargs)

    @http.route('/api/auth/me', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def me(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        token = self._extract_token()
        user = self._user_from_token(token)
        if not user:
            return self._response({
                'success': False,
                'message': 'unauthorized',
            }, status=401)

        return self._response({
            'success': True,
            'data': self._serialize_user(user),
        })

    @http.route('/api/auth/logout', type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False)
    def logout(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        return self._response({
            'success': True,
            'message': 'logged out',
        })

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
