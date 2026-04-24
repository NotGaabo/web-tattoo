# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import ValidationError

class TattooCustomer(models.Model):
    """
    Modelo para gestionar clientes del estudio de tatuajes
    Hereda de res.partner para aprovechar funcionalidades base de contactos
    """
    _name = 'tattoo.customer'
    _description = 'Tattoo Studio Customer'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    # Campos básicos
    name = fields.Char(string='Customer Name', required=True, track_visibility='onchange')
    email = fields.Char(string='Email', required=True)
    phone = fields.Char(string='Phone Number')
    
    # Dirección
    street = fields.Char(string='Street')
    city = fields.Char(string='City')
    state_id = fields.Many2one('res.country.state', string='State')
    zip_code = fields.Char(string='Zip Code')
    country_id = fields.Many2one('res.country', string='Country')
    
    # Información del cliente
    birth_date = fields.Date(string='Birth Date')
    gender = fields.Selection([
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ], string='Gender')
    
    # Historial
    customer_since = fields.Date(string='Customer Since', default=fields.Date.today)
    total_spent = fields.Float(string='Total Amount Spent', compute='_compute_total_spent', store=True)
    number_of_orders = fields.Integer(string='Number of Orders', compute='_compute_number_of_orders', store=True)
    
    # Relaciones
    order_ids = fields.One2many('tattoo.order', 'customer_id', string='Orders')
    appointment_ids = fields.One2many('tattoo.appointment', 'customer_id', string='Appointments')
    review_ids = fields.One2many('tattoo.review', 'customer_id', string='Reviews')
    
    # Estado
    active = fields.Boolean(default=True)
    notes = fields.Text(string='Notes')

    @api.depends('order_ids.total_amount')
    def _compute_total_spent(self):
        """Calcula el total gastado por el cliente"""
        for customer in self:
            customer.total_spent = sum(order.total_amount for order in customer.order_ids if order.state == 'done')

    @api.depends('order_ids')
    def _compute_number_of_orders(self):
        """Calcula el número de órdenes completadas"""
        for customer in self:
            customer.number_of_orders = len(customer.order_ids.filtered(lambda o: o.state == 'done'))

    @api.constrains('email')
    def _check_email(self):
        """Valida que el email sea único"""
        for customer in self:
            if customer.email:
                duplicates = self.search_count([('email', '=', customer.email), ('id', '!=', customer.id)])
                if duplicates:
                    raise ValidationError('Email must be unique!')

    def action_view_orders(self):
        """Acción para ver órdenes del cliente"""
        self.ensure_one()
        return {
            'type': 'ir.actions.act_window',
            'name': f'Orders for {self.name}',
            'res_model': 'tattoo.order',
            'view_mode': 'tree,form',
            'domain': [('customer_id', '=', self.id)],
            'context': {'default_customer_id': self.id}
        }
