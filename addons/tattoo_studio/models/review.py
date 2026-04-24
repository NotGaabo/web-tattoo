# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import ValidationError

class TattooReview(models.Model):
    """
    Modelo para reseñas y ratings de productos, servicios y artistas
    """
    _name = 'tattoo.review'
    _description = 'Tattoo Review & Rating'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    # Información básica
    customer_id = fields.Many2one('tattoo.customer', string='Customer', required=True)
    review_date = fields.Datetime(string='Review Date', default=fields.Datetime.now, readonly=True)
    
    # Tipo de reseña (una reseña puede ser de producto, servicio o artista)
    review_type = fields.Selection([
        ('product', 'Product Review'),
        ('service', 'Service Review'),
        ('artist', 'Artist Review')
    ], string='Review Type', required=True)
    
    # Referencias (solo una será usada según review_type)
    product_id = fields.Many2one('product.template', string='Product', ondelete='cascade')
    service_id = fields.Many2one('tattoo.service', string='Service', ondelete='cascade')
    artist_id = fields.Many2one('tattoo.artist', string='Artist', ondelete='cascade')
    
    # Contenido
    title = fields.Char(string='Review Title')
    comment = fields.Text(string='Comment', required=True)
    rating = fields.Integer(string='Rating (1-5)', required=True)
    
    # Verificación
    verified_purchase = fields.Boolean(string='Verified Purchase', compute='_compute_verified_purchase', store=True)
    helpful_count = fields.Integer(string='Helpful Count', default=0)
    
    # Estado
    state = fields.Selection([
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], string='State', default='draft')
    
    active = fields.Boolean(default=True)

    @api.constrains('rating')
    def _check_rating(self):
        """Valida que el rating esté entre 1 y 5"""
        for review in self:
            if review.rating < 1 or review.rating > 5:
                raise ValidationError('Rating must be between 1 and 5!')

    @api.constrains('review_type', 'product_id', 'service_id', 'artist_id')
    def _check_review_reference(self):
        """Valida que exista exactamente una referencia según tipo"""
        for review in self:
            if review.review_type == 'product' and not review.product_id:
                raise ValidationError('Product is required for product reviews!')
            if review.review_type == 'service' and not review.service_id:
                raise ValidationError('Service is required for service reviews!')
            if review.review_type == 'artist' and not review.artist_id:
                raise ValidationError('Artist is required for artist reviews!')

    @api.depends('review_type', 'product_id', 'service_id', 'artist_id', 'customer_id')
    def _compute_verified_purchase(self):
        """Verifica si la reseña viene de una compra verificada"""
        for review in self:
            verified = False
            
            if review.review_type == 'product' and review.product_id:
                # Verificar si el cliente compró este producto
                orders = review.customer_id.order_ids.filtered(lambda o: o.state == 'done')
                verified = any(line.product_id == review.product_id for order in orders for line in order.order_line_ids)
            
            elif review.review_type == 'service' and review.service_id:
                # Verificar si el cliente contrató este servicio
                appointments = review.customer_id.appointment_ids.filtered(lambda a: a.state == 'completed')
                verified = any(appt.service_id == review.service_id for appt in appointments)
            
            elif review.review_type == 'artist' and review.artist_id:
                # Verificar si el cliente tiene citas completadas con este artista
                appointments = review.customer_id.appointment_ids.filtered(lambda a: a.state == 'completed')
                verified = any(appt.artist_id == review.artist_id for appt in appointments)
            
            review.verified_purchase = verified

    def action_submit(self):
        """Envía la reseña para aprobación"""
        for review in self:
            if review.state == 'draft':
                review.state = 'submitted'

    def action_approve(self):
        """Aprueba la reseña"""
        for review in self:
            if review.state == 'submitted':
                review.state = 'approved'

    def action_reject(self):
        """Rechaza la reseña"""
        for review in self:
            if review.state == 'submitted':
                review.state = 'rejected'

    def get_review_info(self):
        """Retorna información de la reseña en formato JSON para API"""
        return {
            'id': self.id,
            'customerName': self.customer_id.name,
            'rating': self.rating,
            'comment': self.comment,
            'title': self.title or '',
            'date': self.review_date.strftime('%Y-%m-%d'),
            'verified': self.verified_purchase
        }
