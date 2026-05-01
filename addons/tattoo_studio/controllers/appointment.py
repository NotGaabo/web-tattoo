# -*- coding: utf-8 -*-

import json
from datetime import datetime, timedelta, time, timezone
from odoo import http
from odoo.http import request
from werkzeug.wrappers import Response


class TattooAppointmentController(http.Controller):
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

    def _get_user_from_token(self):
        """Extract user from Authorization header"""
        auth_header = request.httprequest.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        token = auth_header[7:]
        user = request.env['res.users'].sudo().search([('api_token', '=', token)], limit=1)
        return user

    def _get_or_create_customer(self, user):
        if not user:
            return None

        Customer = request.env['tattoo.customer'].sudo()
        partner = user.partner_id.sudo()
        customer_email = (partner.email or user.login or '').strip().lower()

        domain = [('user_id', '=', user.id)]
        if customer_email:
            domain = ['|', ('user_id', '=', user.id), ('email', '=', customer_email)]

        customer = Customer.search(domain, limit=1)
        if customer:
            updates = {
                'name': (partner.name or user.name or customer.name or '').strip() or customer.name,
                'email': customer_email or customer.email,
                'phone': (partner.phone or '').strip() or customer.phone,
                'user_id': user.id,
            }
            customer.write(updates)
            return customer

        return Customer.create({
            'name': (partner.name or user.name or user.login or '').strip() or user.login,
            'email': customer_email or user.login,
            'phone': (partner.phone or '').strip(),
            'user_id': user.id,
        })

    def _serialize_appointment(self, appointment):
        return {
            'id': appointment.id,
            'customer_id': appointment.customer_id.id,
            'customer_name': appointment.customer_id.name,
            'artist_id': appointment.artist_id.id,
            'artist_name': appointment.artist_id.name,
            'service_id': appointment.service_id.id,
            'service_name': appointment.service_id.name,
            'appointment_datetime': appointment.appointment_datetime,
            'end_datetime': appointment.end_datetime,
            'state': appointment.state,
            'deposit_amount': appointment.deposit_amount,
            'remaining_balance': appointment.remaining_balance,
            'work_type': appointment.work_type,
            'color_preference': appointment.color_preference,
            'size_area': appointment.size_area,
            'design_description': appointment.design_description,
            'allergies': appointment.allergies or '',
            'medications': appointment.medications or '',
            'previous_tattoos': appointment.previous_tattoos,
        }

    def _get_available_slots(self, artist_id, date_str):
        """Calculate available time slots for an artist on a specific date"""
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return []

        artist = request.env['tattoo.artist'].sudo().browse(artist_id)
        if not artist.exists() or not artist.is_available:
            return []

        # Check for studio-wide or artist-specific exceptions
        exceptions = request.env['tattoo.exception'].sudo().search([
            '|',
            ('artist_id', '=', artist_id),
            ('artist_id', '=', False),
            ('date', '=', date),
            ('is_closed', '=', True),
            ('active', '=', True)
        ])
        if exceptions:
            return []

        # Get day of week using the same convention as tattoo.artist.availability
        # 0 = Monday, 6 = Sunday
        day_of_week = str(date.weekday())

        availability = request.env['tattoo.artist.availability'].sudo().search([
            ('artist_id', '=', artist_id),
            ('day_of_week', '=', day_of_week),
            ('active', '=', True)
        ], limit=1)

        if not availability:
            return []

        # Generate slots (1-hour intervals)
        slots = []
        current = datetime.combine(date, time(hour=int(availability.start_time), minute=int((availability.start_time % 1) * 60)))
        end = datetime.combine(date, time(hour=int(availability.end_time), minute=int((availability.end_time % 1) * 60)))

        while current < end:
            slot_end = current + timedelta(hours=1)
            if slot_end <= end:
                # Check if slot conflicts with existing appointments
                conflicting = request.env['tattoo.appointment'].sudo().search([
                    ('artist_id', '=', artist_id),
                    ('appointment_datetime', '<', slot_end),
                    ('end_datetime', '>', current),
                    ('state', 'in', ['confirmed', 'pending'])
                ], limit=1)
                if not conflicting:
                    slots.append({
                        'start': current.isoformat(),
                        'end': slot_end.isoformat(),
                    })
            current = slot_end

        return slots

    @http.route('/api/appointments', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_appointments(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        user = self._get_user_from_token()
        if not user:
            return self._response({'success': False, 'message': 'Unauthorized'}, status=401)

        # Find customer linked to user
        customer = self._get_or_create_customer(user)
        if not customer:
            return self._response({'success': False, 'message': 'Customer not found'}, status=404)

        appointments = request.env['tattoo.appointment'].sudo().search([
            ('customer_id', '=', customer.id)
        ], order='appointment_datetime desc')

        return self._response({
            'success': True,
            'data': [self._serialize_appointment(appt) for appt in appointments],
        })

    @http.route('/api/appointments', type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False)
    def create_appointment(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        user = self._get_user_from_token()
        if not user:
            return self._response({'success': False, 'message': 'Unauthorized'}, status=401)

        try:
            data = json.loads(request.httprequest.data)
        except json.JSONDecodeError:
            return self._response({'success': False, 'message': 'Invalid JSON'}, status=400)

        required_fields = ['artist_id', 'service_id', 'appointment_datetime']
        for field in required_fields:
            if field not in data:
                return self._response({'success': False, 'message': f'Missing {field}'}, status=400)

        customer = self._get_or_create_customer(user)
        if not customer:
            return self._response({'success': False, 'message': 'Customer not found'}, status=404)

        artist = request.env['tattoo.artist'].sudo().browse(data['artist_id'])
        service = request.env['tattoo.service'].sudo().browse(data['service_id'])

        if not artist.exists() or not service.exists():
            return self._response({'success': False, 'message': 'Invalid artist or service'}, status=400)

        # Validate datetime
        try:
            appt_datetime = datetime.fromisoformat(data['appointment_datetime'].replace('Z', '+00:00'))
            if appt_datetime.tzinfo is not None:
                appt_datetime = appt_datetime.astimezone(timezone.utc).replace(tzinfo=None)
        except ValueError:
            return self._response({'success': False, 'message': 'Invalid datetime format'}, status=400)

        if appt_datetime <= datetime.utcnow():
            return self._response({'success': False, 'message': 'Appointment must be in the future'}, status=400)

        # Check availability
        date_str = appt_datetime.date().isoformat()
        slots = self._get_available_slots(data['artist_id'], date_str)
        slot_start = appt_datetime
        slot_end = slot_start + timedelta(hours=service.estimated_time_hours)

        available = any(
            datetime.fromisoformat(slot['start']) <= slot_start and datetime.fromisoformat(slot['end']) >= slot_end
            for slot in slots
        )
        if not available:
            return self._response({'success': False, 'message': 'Time slot not available'}, status=400)

        # Create appointment
        appointment = request.env['tattoo.appointment'].sudo().create({
            'customer_id': customer.id,
            'artist_id': data['artist_id'],
            'service_id': data['service_id'],
            'appointment_datetime': appt_datetime,
            'work_type': data.get('work_type', 'new'),
            'color_preference': data.get('color_preference'),
            'size_area': data.get('size_area') or data.get('body_area'),
            'design_description': data.get('design_description'),
            'allergies': data.get('allergies') or data.get('medical_info') or '',
            'medications': data.get('medications') or '',
            'previous_tattoos': bool(data.get('previous_tattoos', False)),
        })

        return self._response({
            'success': True,
            'data': self._serialize_appointment(appointment),
        }, status=201)

    @http.route('/api/artists/<int:artist_id>/availability', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_artist_availability(self, artist_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        date_str = request.httprequest.args.get('date')
        if not date_str:
            return self._response({'success': False, 'message': 'Date parameter required'}, status=400)

        slots = self._get_available_slots(artist_id, date_str)
        return self._response({
            'success': True,
            'data': slots,
        })

    @http.route('/api/appointments/<int:appointment_id>', type='http', auth='public', methods=['PUT', 'OPTIONS'], csrf=False)
    def update_appointment(self, appointment_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._preflight()

        user = self._get_user_from_token()
        if not user:
            return self._response({'success': False, 'message': 'Unauthorized'}, status=401)

        customer = self._get_or_create_customer(user)
        appointment = request.env['tattoo.appointment'].sudo().browse(appointment_id)

        if not appointment.exists() or appointment.customer_id != customer:
            return self._response({'success': False, 'message': 'Appointment not found'}, status=404)

        try:
            data = json.loads(request.httprequest.data)
        except json.JSONDecodeError:
            return self._response({'success': False, 'message': 'Invalid JSON'}, status=400)

        allowed_states = ['cancelled']  # Only allow cancellation for now
        if 'state' in data and data['state'] in allowed_states:
            appointment.write({'state': data['state']})

        return self._response({
            'success': True,
            'data': self._serialize_appointment(appointment),
        })
