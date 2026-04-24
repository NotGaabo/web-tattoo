# -*- coding: utf-8 -*-

from odoo import models, fields, api

class TattooService(models.Model):
    """
    Modelo para servicios de tatuaje (pequeño, mediano, grande)
    """
    _name = 'tattoo.service'
    _description = 'Tattoo Service'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    # Información básica
    name = fields.Char(string='Service Name', required=True)
    service_type = fields.Selection([
        ('small', 'Small (0-5cm²)'),
        ('medium', 'Medium (5-20cm²)'),
        ('large', 'Large (20cm²+)')
    ], string='Service Type', required=True)
    
    # Descripción
    description = fields.Text(string='Description')
    
    # Precios y tiempo
    base_price = fields.Float(string='Base Price', required=True)
    estimated_time_hours = fields.Float(string='Estimated Time (hours)')
    
    # Colores disponibles
    available_colors = fields.Selection([
        ('black', 'Black & Gray'),
        ('color', 'Full Color'),
        ('all', 'All Colors')
    ], string='Available Colors', default='black')
    
    # Relaciones
    appointment_ids = fields.One2many('tattoo.appointment', 'service_id', string='Appointments')
    review_ids = fields.One2many('tattoo.review', 'service_id', string='Reviews')
    artist_ids = fields.Many2many('tattoo.artist', 'tattoo_service_artist_rel', 'service_id', 'artist_id', string='Available Artists')
    
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
            'type': self.service_type,
            'price': self.base_price,
            'estimatedTime': f'{int(self.estimated_time_hours * 60)} min',
            'colors': self.available_colors,
            'description': self.description or '',
            'artists': [artist.id for artist in self.artist_ids]
        }
