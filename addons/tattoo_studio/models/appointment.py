# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import ValidationError
from datetime import datetime, timedelta

class TattooAppointment(models.Model):
    """
    Modelo para citas de tatuaje
    """
    _name = 'tattoo.appointment'
    _description = 'Tattoo Appointment'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    # Información básica
    name = fields.Char(string='Appointment Name', compute='_compute_name', store=True)
    customer_id = fields.Many2one('tattoo.customer', string='Customer', required=True, track_visibility='onchange')
    artist_id = fields.Many2one('tattoo.artist', string='Tattoo Artist', required=True)
    service_id = fields.Many2one('tattoo.service', string='Service', required=True)
    
    # Fechas y horarios
    appointment_datetime = fields.Datetime(string='Appointment Date & Time', required=True)
    duration_hours = fields.Float(string='Duration (hours)', compute='_compute_duration', store=True)
    end_datetime = fields.Datetime(string='End Date & Time', compute='_compute_end_datetime', store=True)
    
    # Tipo de trabajo
    work_type = fields.Selection([
        ('new', 'New Tattoo'),
        ('cover', 'Cover'),
        ('modification', 'Modification'),
        ('touch', 'Touch Up')
    ], string='Work Type', default='new', required=True)
    
    # Descripción del diseño
    design_description = fields.Text(string='Design Description')
    design_image = fields.Image(string='Design Image')
    
    # Preferencias
    color_preference = fields.Selection([
        ('black', 'Black & Gray'),
        ('color', 'Full Color')
    ], string='Color Preference', default='black')
    size_area = fields.Char(string='Tattoo Area')
    
    # Información médica
    allergies = fields.Text(string='Allergies/Sensitivities')
    medications = fields.Text(string='Current Medications')
    previous_tattoos = fields.Boolean(string='Has Previous Tattoos')
    
    # Estado
    state = fields.Selection([
        ('draft', 'Draft'),
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled')
    ], string='State', default='draft', track_visibility='onchange')
    
    # Pago y depósito
    deposit_amount = fields.Float(string='Deposit Required', compute='_compute_deposit')
    deposit_paid = fields.Boolean(string='Deposit Paid', default=False)
    remaining_balance = fields.Float(string='Remaining Balance', compute='_compute_balance', store=True)
    
    # Notas
    notes = fields.Text(string='Notes')
    customer_notes = fields.Text(string='Customer Notes')
    
    # Referencia a orden si es un servicio de pago
    order_id = fields.Many2one('tattoo.order', string='Related Order')

    @api.depends('customer_id', 'artist_id', 'appointment_datetime')
    def _compute_name(self):
        """Genera nombre de la cita"""
        for appointment in self:
            if appointment.customer_id and appointment.artist_id and appointment.appointment_datetime:
                date_str = appointment.appointment_datetime.strftime('%Y-%m-%d %H:%M')
                appointment.name = f'{appointment.customer_id.name} - {appointment.artist_id.name} ({date_str})'
            else:
                appointment.name = 'New Appointment'

    @api.depends('service_id')
    def _compute_duration(self):
        """Obtiene duración del servicio"""
        for appointment in self:
            appointment.duration_hours = appointment.service_id.estimated_time_hours if appointment.service_id else 0

    @api.depends('appointment_datetime', 'duration_hours')
    def _compute_end_datetime(self):
        """Calcula fecha/hora final"""
        for appointment in self:
            if appointment.appointment_datetime and appointment.duration_hours:
                appointment.end_datetime = appointment.appointment_datetime + timedelta(hours=appointment.duration_hours)
            else:
                appointment.end_datetime = appointment.appointment_datetime

    @api.depends('service_id')
    def _compute_deposit(self):
        """Calcula el depósito requerido (30% del servicio)"""
        for appointment in self:
            if appointment.service_id:
                appointment.deposit_amount = appointment.service_id.base_price * 0.30
            else:
                appointment.deposit_amount = 0

    @api.depends('service_id', 'deposit_paid')
    def _compute_balance(self):
        """Calcula el balance pendiente"""
        for appointment in self:
            if appointment.service_id:
                remaining = appointment.service_id.base_price - appointment.deposit_amount if appointment.deposit_paid else appointment.service_id.base_price
                appointment.remaining_balance = remaining
            else:
                appointment.remaining_balance = 0

    @api.constrains('appointment_datetime')
    def _check_future_date(self):
        """Valida que la cita sea en el futuro"""
        for appointment in self:
            if appointment.appointment_datetime < fields.Datetime.now():
                raise ValidationError('Appointment date must be in the future!')

    def action_confirm(self):
        """Confirma la cita"""
        for appointment in self:
            if appointment.state == 'pending':
                appointment.state = 'confirmed'

    def action_complete(self):
        """Marca la cita como completada"""
        for appointment in self:
            appointment.state = 'completed'

    def action_cancel(self):
        """Cancela la cita"""
        for appointment in self:
            if appointment.state in ['draft', 'pending', 'confirmed']:
                appointment.state = 'cancelled'
            else:
                raise ValidationError('Cannot cancel a completed appointment!')

    def action_reschedule(self):
        """Marca para reprogramar"""
        for appointment in self:
            appointment.state = 'rescheduled'
