# -*- coding: utf-8 -*-

import json

from odoo.http import request
from werkzeug.wrappers import Response


class TattooApiControllerMixin:
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
            ('api_token', '=', token),
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

    def _safe_int(self, value, default=None):
        try:
            return int(value)
        except (TypeError, ValueError):
            return default
