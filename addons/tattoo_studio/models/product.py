# -*- coding: utf-8 -*-

from odoo import models, fields, api

class TattooProduct(models.Model):
    """
    Modelo para productos (suplementos y cuidados de tatuajes)
    """
    _inherit = 'product.template'
    _description = 'Tattoo Supplement Product'

    # Información básica
    code = fields.Char(string='Product Code')
    brand = fields.Char(string='Brand')

    # Descripción
    description = fields.Text(string='Description', related='description_sale', readonly=False)
    usage_instructions = fields.Html(string='Usage Instructions')

    # Precios
    cost_price = fields.Float(string='Cost Price', related='standard_price', readonly=False)
    sale_price = fields.Float(string='Sale Price', related='list_price', readonly=False)

    # Inventario
    quantity_available = fields.Float(string='Available Quantity', compute='_compute_quantity')
    quantity_reserved = fields.Float(string='Reserved Quantity', default=0.0)

    # Categoría
    category_id = fields.Many2one('product.category', string='Category')

    # Información adicional
    weight = fields.Float(string='Weight (g)')
    volume = fields.Float(string='Volume (ml)')

    # Relaciones
    order_line_ids = fields.One2many('tattoo.order.line', 'product_id', string='Order Lines')
    review_ids = fields.One2many('tattoo.review', 'product_id', string='Reviews')

    # Estadísticas
    average_rating = fields.Float(string='Average Rating', compute='_compute_average_rating', store=True)
    total_reviews = fields.Integer(string='Total Reviews', compute='_compute_total_reviews', store=True)
    total_sales = fields.Float(string='Total Sales', compute='_compute_total_sales', store=True)

    @api.depends('qty_available')
    def _compute_quantity(self):
        """Mantiene un alias legible para la cantidad disponible de Odoo."""
        for product in self:
            product.quantity_available = product.qty_available

    @api.depends('review_ids.rating')
    def _compute_average_rating(self):
        """Calcula el rating promedio del producto"""
        for product in self:
            ratings = product.review_ids.mapped('rating')
            product.average_rating = sum(ratings) / len(ratings) if ratings else 0.0

    @api.depends('review_ids')
    def _compute_total_reviews(self):
        """Cuenta el total de reseñas"""
        for product in self:
            product.total_reviews = len(product.review_ids)

    @api.depends('order_line_ids.subtotal')
    def _compute_total_sales(self):
        """Calcula el total de ventas del producto"""
        for product in self:
            product.total_sales = sum(line.subtotal for line in product.order_line_ids if line.order_id.state == 'done')

    def get_product_info(self):
        """Retorna información del producto en formato JSON para API"""
        return {
            'id': self.id,
            'name': self.name,
            'brand': self.brand,
            'price': self.list_price,
            'description': self.description or '',
            'rating': self.average_rating,
            'reviewCount': self.total_reviews,
            'available': self.quantity_available
        }
