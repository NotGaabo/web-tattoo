# -*- coding: utf-8 -*-

from odoo import models, fields, api


class TattooProductBrand(models.Model):
    _name = 'tattoo.product.brand'
    _description = 'Tattoo Product Brand'
    _order = 'name'

    name = fields.Char(string='Brand Name', required=True)
    active = fields.Boolean(default=True)
    product_ids = fields.One2many('product.template', 'brand_id', string='Products')
    product_count = fields.Integer(string='Products', compute='_compute_product_count')

    _sql_constraints = [
        ('tattoo_product_brand_name_unique', 'unique(name)', 'Brand name must be unique.'),
    ]

    def _compute_product_count(self):
        for brand in self:
            brand.product_count = len(brand.product_ids)

class TattooProduct(models.Model):
    """
    Modelo para productos (suplementos y cuidados de tatuajes)
    """
    _inherit = 'product.template'
    _description = 'Tattoo Supplement Product'

    # Información básica
    code = fields.Char(string='Product Code')
    brand = fields.Char(string='Brand', compute='_compute_brand', inverse='_inverse_brand', store=True)
    brand_id = fields.Many2one('tattoo.product.brand', string='Brand', ondelete='set null')

    # Descripción
    description = fields.Text(string='Description', related='description_sale', readonly=False)
    usage_instructions = fields.Html(string='Usage Instructions')

    # Precios
    cost_price = fields.Float(string='Cost Price', related='standard_price', readonly=False)
    sale_price = fields.Float(string='Sale Price', related='list_price', readonly=False)

    # Inventario
    quantity_available = fields.Float(string='Available Quantity', compute='_compute_quantity', inverse='_inverse_quantity')
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

    def _get_primary_stock_location(self):
        warehouse = self.env['stock.warehouse'].sudo().search([
            ('company_id', '=', self.env.company.id),
        ], limit=1)
        if warehouse and warehouse.lot_stock_id:
            return warehouse.lot_stock_id
        return self.env['stock.location'].sudo().search([
            ('usage', '=', 'internal'),
            ('company_id', 'in', [self.env.company.id, False]),
        ], limit=1)

    def _set_available_quantity(self, target_quantity):
        stock_quant_model = self.env['stock.quant'].sudo()
        location = self._get_primary_stock_location()

        if not location:
            return

        for product in self:
            if 'is_storable' in product._fields and not product.is_storable:
                product.sudo().write({'is_storable': True})

            variant = product.product_variant_id
            if not variant:
                continue
            if 'is_storable' in variant._fields and not variant.is_storable:
                variant.sudo().write({'is_storable': True})
            current_quantity = variant.qty_available
            diff = float(target_quantity) - float(current_quantity)
            if abs(diff) > 1e-6:
                stock_quant_model._update_available_quantity(variant, location, diff)

    def _inverse_quantity(self):
        for product in self:
            product._set_available_quantity(product.quantity_available)

    @api.depends('brand_id.name')
    def _compute_brand(self):
        for product in self:
            product.brand = product.brand_id.name or ''

    def _inverse_brand(self):
        brand_model = self.env['tattoo.product.brand'].sudo()
        for product in self:
            brand_name = (product.brand or '').strip()
            if not brand_name:
                product.brand_id = False
                continue
            brand = brand_model.search([('name', '=ilike', brand_name)], limit=1)
            if not brand:
                brand = brand_model.create({'name': brand_name})
            product.brand_id = brand

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
