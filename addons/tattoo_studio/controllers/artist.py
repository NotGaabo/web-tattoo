# -*- coding: utf-8 -*-

import json

from odoo import http
from odoo.http import request
from werkzeug.wrappers import Response


class TattooArtistController(http.Controller):
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

    def _serialize_artist(self, artist):
        return {
            'id': artist.id,
            'name': artist.name,
            'specialization': artist.specialization or '',
            'years_of_experience': artist.years_of_experience or 0,
            'biography': artist.biography or '',
            'rating': artist.average_rating or 0.0,
            'reviewCount': artist.total_reviews or 0,
            'total_completed_appointments': artist.total_completed_appointments or 0,
            'is_available': artist.is_available,
            'email': artist.email or '',
            'phone': artist.phone or '',
            'skills': [skill.name for skill in artist.skill_ids],
            'portfolio': [
                {
                    'id': img.id,
                    'url': img.image_url or '',
                    'title': img.title or '',
                } for img in artist.portfolio_image_ids
            ],
        }

    @http.route('/api/artists', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_artists(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        artists = request.env['tattoo.artist'].sudo().search([('active', '=', True)], order='id desc')
        return self._response({
            'success': True,
            'data': [self._serialize_artist(artist) for artist in artists],
        })

    @http.route('/api/artists/<int:artist_id>', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_artist_detail(self, artist_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        artist = request.env['tattoo.artist'].sudo().browse(artist_id)
        if not artist.exists():
            return self._response({
                'success': False,
                'message': 'artist not found',
            }, status=404)

        return self._response({
            'success': True,
            'data': self._serialize_artist(artist),
        })
