# -*- coding: utf-8 -*-

from odoo import models, fields, api

class TattooService(models.Model):
    """
    Modelo para servicios generales del estudio
    """
    _name = 'tattoo.service'
    _description = 'Tattoo Service'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    # Información básica
    name = fields.Char(string='Service Name', required=True)
    
    # Descripción
    description = fields.Text(string='Description')
    
    # Relaciones
    appointment_ids = fields.One2many('tattoo.appointment', 'service_id', string='Appointments')
    review_ids = fields.One2many('tattoo.review', 'service_id', string='Reviews')
    
    # Estadísticas
    total_appointments = fields.Integer(string='Total Appointments', compute='_compute_total_appointments', store=True)
    average_rating = fields.Float(string='Average Rating', compute='_compute_average_rating', store=True)
    
    # Estado
    active = fields.Boolean(default=True)

    @api.depends('appointment_ids')
    def _compute_total_appointments(self):
        """Cuenta el total de citas para este servicio"""
        for service in self:
            service.total_appointments = len(service.appointment_ids.filtered(lambda a: a.state == 'confirmed'))

    @api.depends('review_ids.rating')
    def _compute_average_rating(self):
        """Calcula el rating promedio del servicio"""
        for service in self:
            ratings = service.review_ids.mapped('rating')
            service.average_rating = sum(ratings) / len(ratings) if ratings else 0.0

    def get_service_info(self):
        """Retorna información del servicio en formato JSON para API"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description or '',
            'active': self.active,
        }
