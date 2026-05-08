# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request

from .api_utils import TattooApiControllerMixin


class TattooReviewController(TattooApiControllerMixin, http.Controller):
    def _customer_from_user(self, user):
        if not user:
            return False

        email = (user.partner_id.email or user.login or '').strip().lower()
        if not email:
            return False

        return request.env['tattoo.customer'].sudo().search([
            ('email', '=', email),
        ], limit=1)

    def _review_domain_for_item(self, item_type, item_id):
        base_domain = [('review_type', '=', item_type), ('active', '=', True)]

        if item_type == 'artist':
            return base_domain + [('artist_id', '=', item_id)]
        if item_type == 'product':
            return base_domain + [('product_id', '=', item_id)]
        if item_type == 'service':
            return base_domain + [('service_id', '=', item_id)]
        return None

    def _has_customer_reviewed(self, customer, item_type, item_id):
        if not customer:
            return False

        duplicate_domain = [
            ('customer_id', '=', customer.id),
            ('review_type', '=', item_type),
            ('active', '=', True),
            (f'{item_type}_id', '=', item_id),
        ]
        return bool(request.env['tattoo.review'].sudo().search_count(duplicate_domain))

    @http.route('/api/reviews/<string:item_type>/<int:item_id>', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def reviews_by_item(self, item_type, item_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        if item_type not in ('artist', 'product', 'service'):
            return self._response({
                'success': False,
                'message': 'invalid review type',
            }, status=400)

        domain = self._review_domain_for_item(item_type, item_id)
        reviews = request.env['tattoo.review'].sudo().search(domain, order='review_date desc, id desc')
        user = self._user_from_token(self._extract_token())
        customer = self._customer_from_user(user) if user else False

        return self._response({
            'success': True,
            'data': [review.get_review_info() for review in reviews],
            'meta': {
                'has_reviewed': self._has_customer_reviewed(customer, item_type, item_id),
            },
        })

    @http.route('/api/reviews', type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False)
    def create_review(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        user, error_response = self._require_user()
        if error_response:
            return error_response

        data = self._json_body()
        review_type = (data.get('itemType') or data.get('review_type') or '').strip().lower()
        if review_type not in ('artist', 'product', 'service'):
            return self._response({
                'success': False,
                'message': 'invalid review type',
            }, status=400)

        customer = self._customer_from_user(user)
        if not customer:
            return self._response({
                'success': False,
                'message': 'customer not found for user',
            }, status=404)

        rating = self._safe_int(data.get('rating'))
        comment = (data.get('comment') or '').strip()
        title = (data.get('title') or '').strip()
        item_id = self._safe_int(data.get('itemId') or data.get(f'{review_type}_id'))

        if not item_id or not rating or not comment:
            return self._response({
                'success': False,
                'message': 'itemId, rating and comment are required',
            }, status=400)

        duplicate_domain = [
            ('customer_id', '=', customer.id),
            ('review_type', '=', review_type),
            ('active', '=', True),
        ]
        duplicate_domain.append((f'{review_type}_id', '=', item_id))
        duplicate = request.env['tattoo.review'].sudo().search(duplicate_domain, limit=1)
        if duplicate:
            return self._response({
                'success': False,
                'message': 'Ya enviaste una calificacion para este elemento.',
            }, status=409)

        values = {
            'customer_id': customer.id,
            'review_type': review_type,
            'rating': rating,
            'comment': comment,
            'title': title or False,
            'state': 'approved',
        }
        values[f'{review_type}_id'] = item_id

        review = request.env['tattoo.review'].sudo().create(values)

        return self._response({
            'success': True,
            'message': 'review created',
            'data': review.get_review_info(),
        }, status=201)
