# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import ValidationError
from datetime import datetime, timedelta

class TattooOrder(models.Model):
    """
    Modelo para órdenes de compra de productos
    """
    _name = 'tattoo.order'
    _description = 'Tattoo Order'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    # Información básica
    order_number = fields.Char(string='Order Number', readonly=True, default='/')
    customer_id = fields.Many2one('tattoo.customer', string='Customer', required=True, track_visibility='onchange')
    order_date = fields.Datetime(string='Order Date', default=fields.Datetime.now, readonly=True)
    
    # Líneas de orden
    order_line_ids = fields.One2many('tattoo.order.line', 'order_id', string='Order Lines')
    
    # Cantidades
    total_quantity = fields.Integer(string='Total Quantity', compute='_compute_totals', store=True)
    
    # Montos
    subtotal = fields.Float(string='Subtotal', compute='_compute_totals', store=True)
    tax_amount = fields.Float(string='Tax Amount', compute='_compute_totals', store=True)
    total_amount = fields.Float(string='Total Amount', compute='_compute_totals', store=True)
    
    # Información de entrega
    delivery_address = fields.Text(string='Delivery Address')
    delivery_date = fields.Date(string='Expected Delivery Date')
    delivery_state = fields.Selection([
        ('pending', 'Pending'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered')
    ], string='Delivery State', default='pending')
    
    # Estado de la orden
    state = fields.Selection([
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('done', 'Delivered'),
        ('cancelled', 'Cancelled')
    ], string='State', default='draft', track_visibility='onchange')
    
    # Método de pago
    payment_method = fields.Selection([
        ('transfer', 'Bank Transfer'),
        ('card', 'Credit Card'),
        ('cash', 'Cash'),
        ('other', 'Other')
    ], string='Payment Method', default='transfer')
    payment_state = fields.Selection([
        ('not_paid', 'Not Paid'),
        ('partial', 'Partially Paid'),
        ('paid', 'Paid')
    ], string='Payment State', default='not_paid', track_visibility='onchange')
    
    # Notas
    notes = fields.Text(string='Notes')

    # Usuario responsable
    user_id = fields.Many2one('res.users', string='Responsible User', default=lambda self: self.env.user)
    stock_reserved = fields.Boolean(string='Stock Reserved', default=False, readonly=True)
    stock_committed = fields.Boolean(string='Stock Committed', default=False, readonly=True)

    @api.model
    def create(self, vals_list):
        """Genera número de orden automático"""
        if isinstance(vals_list, dict):
            vals_list = [vals_list]

        for vals in vals_list:
            if vals.get('order_number', '/') == '/':
                vals['order_number'] = (
                    self.env['ir.sequence'].next_by_code('tattoo.order')
                    or f"ORD-{fields.Datetime.now().strftime('%Y%m%d%H%M%S')}"
                )
        return super().create(vals_list)

    @api.depends('order_line_ids.quantity', 'order_line_ids.unit_price')
    def _compute_totals(self):
        """Calcula totales de la orden"""
        for order in self:
            lines_data = order.order_line_ids.read(['quantity', 'unit_price', 'subtotal'])
            
            total_quantity = sum(line['quantity'] for line in lines_data)
            subtotal = sum(line['subtotal'] for line in lines_data)
            
            # Calcular impuestos (21% IVA)
            tax_amount = subtotal * 0.21
            total_amount = subtotal + tax_amount
            
            order.total_quantity = total_quantity
            order.subtotal = subtotal
            order.tax_amount = tax_amount
            order.total_amount = total_amount

    @api.constrains('order_line_ids')
    def _check_lines(self):
        for order in self:
            if not order.order_line_ids:
                raise ValidationError('Orders require at least one product line.')
            invalid_line = order.order_line_ids.filtered(lambda line: line.quantity <= 0 or not line.product_id)
            if invalid_line:
                raise ValidationError('Every order line must have a product and a quantity greater than zero.')

    def _line_sellable_quantity(self, line):
        product = line.product_id.sudo()
        return max((product.quantity_available or 0.0) - (product.quantity_reserved or 0.0), 0.0)

    def action_reserve_stock(self):
        for order in self:
            if order.stock_reserved or order.stock_committed:
                continue

            for line in order.order_line_ids:
                sellable_quantity = order._line_sellable_quantity(line)
                if line.quantity > sellable_quantity:
                    raise ValidationError(
                        f'Only {int(sellable_quantity)} unit(s) of {line.product_id.name} are available.'
                    )

            for line in order.order_line_ids:
                product = line.product_id.sudo()
                product.write({
                    'quantity_reserved': (product.quantity_reserved or 0.0) + line.quantity,
                })

            order.stock_reserved = True

    def _release_reserved_stock(self):
        for order in self:
            if not order.stock_reserved:
                continue

            for line in order.order_line_ids:
                product = line.product_id.sudo()
                product.write({
                    'quantity_reserved': max((product.quantity_reserved or 0.0) - line.quantity, 0.0),
                })

            order.stock_reserved = False

    def _commit_reserved_stock(self):
        for order in self:
            if order.stock_committed:
                continue
            if not order.stock_reserved:
                order.action_reserve_stock()

            for line in order.order_line_ids:
                product = line.product_id.sudo()
                product.write({
                    'quantity_available': max((product.quantity_available or 0.0) - line.quantity, 0.0),
                    'quantity_reserved': max((product.quantity_reserved or 0.0) - line.quantity, 0.0),
                })

            order.stock_reserved = False
            order.stock_committed = True

    def _restore_committed_stock(self):
        for order in self:
            if not order.stock_committed:
                continue

            for line in order.order_line_ids:
                product = line.product_id.sudo()
                product.write({
                    'quantity_available': (product.quantity_available or 0.0) + line.quantity,
                })

            order.stock_committed = False

    def action_accept(self):
        """Acepta la orden despues de confirmar el pago y descuenta stock real."""
        for order in self:
            if order.state in ['cancelled', 'done']:
                raise ValidationError('Cancelled or delivered orders cannot be accepted.')
            order._commit_reserved_stock()
            order.state = 'confirmed'
            order.payment_state = 'paid'
            order.user_id = self.env.user

    def action_confirm(self):
        """Confirma la orden desde Odoo."""
        for order in self:
            if order.payment_state != 'paid':
                raise ValidationError('Order must be paid before being confirmed.')
            order._commit_reserved_stock()
            order.state = 'confirmed'
            order.user_id = self.env.user

    def action_process(self):
        """Procesa la orden"""
        for order in self:
            if order.payment_state != 'paid':
                raise ValidationError('Only paid orders can be processed.')
            if order.state not in ['confirmed']:
                raise ValidationError('Only confirmed orders can be processed.')
            order.state = 'processing'

    def action_ship(self):
        """Marca la orden como enviada"""
        for order in self:
            if order.state != 'processing':
                raise ValidationError('Only processing orders can be shipped.')
            order.state = 'shipped'
            order.delivery_state = 'shipped'
            order.delivery_date = fields.Date.today() + timedelta(days=3)

    def action_deliver(self):
        """Completa la entrega"""
        for order in self:
            if order.state != 'shipped':
                raise ValidationError('Only shipped orders can be delivered.')
            order.state = 'done'
            order.delivery_state = 'delivered'

    def action_complete(self):
        """Cierra la orden desde gestion con un solo paso."""
        for order in self:
            if order.state in ['cancelled', 'done']:
                raise ValidationError('Cancelled or completed orders cannot be completed again.')

            if not order.stock_committed:
                order._commit_reserved_stock()

            order.payment_state = 'paid'
            order.state = 'done'
            order.delivery_state = 'delivered'
            order.delivery_date = fields.Date.today()
            order.user_id = self.env.user

    def action_cancel(self):
        """Cancela la orden"""
        for order in self:
            if order.state in ['shipped', 'done']:
                raise ValidationError('Shipped or delivered orders cannot be cancelled!')

            if order.stock_committed:
                order._restore_committed_stock()
            elif order.stock_reserved:
                order._release_reserved_stock()

            order.state = 'cancelled'
            order.delivery_state = 'pending'


class TattooOrderLine(models.Model):
    """
    Modelo para líneas de orden
    """
    _name = 'tattoo.order.line'
    _description = 'Tattoo Order Line'

    order_id = fields.Many2one('tattoo.order', string='Order', required=True, ondelete='cascade')
    product_id = fields.Many2one('product.template', string='Product', required=True)
    
    # Cantidad y precios
    quantity = fields.Integer(string='Quantity', default=1)
    unit_price = fields.Float(string='Unit Price', compute='_compute_unit_price', store=True)
    subtotal = fields.Float(string='Subtotal', compute='_compute_subtotal', store=True)
    
    # Descuento (opcional)
    discount_percentage = fields.Float(string='Discount %', default=0)
    discount_amount = fields.Float(string='Discount Amount', compute='_compute_discount', store=True)

    @api.depends('product_id')
    def _compute_unit_price(self):
        """Obtiene el precio del producto"""
        for line in self:
            line.unit_price = line.product_id.list_price if line.product_id else 0

    @api.constrains('quantity')
    def _check_quantity(self):
        for line in self:
            if line.quantity <= 0:
                raise ValidationError('Order line quantity must be greater than zero.')

    @api.depends('quantity', 'unit_price', 'discount_percentage')
    def _compute_subtotal(self):
        """Calcula el subtotal de la línea"""
        for line in self:
            subtotal = line.quantity * line.unit_price
            discount = (subtotal * line.discount_percentage) / 100
            line.subtotal = subtotal - discount

    @api.depends('quantity', 'unit_price', 'discount_percentage')
    def _compute_discount(self):
        """Calcula el descuento en monto"""
        for line in self:
            subtotal = line.quantity * line.unit_price
            line.discount_amount = (subtotal * line.discount_percentage) / 100
