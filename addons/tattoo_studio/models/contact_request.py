# -*- coding: utf-8 -*-

from odoo import api, fields, models


class TattooContactRequest(models.Model):
    _name = 'tattoo.contact.request'
    _description = 'Tattoo Contact Request'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'create_date desc'

    name = fields.Char(string='Reference', readonly=True, default='New')
    customer_id = fields.Many2one('tattoo.customer', string='Customer', required=True, tracking=True)
    user_id = fields.Many2one('res.users', string='Portal User', readonly=True)
    subject = fields.Char(string='Subject', required=True)
    message = fields.Text(string='Message', required=True)
    whatsapp_message = fields.Text(string='WhatsApp Message', readonly=True)
    state = fields.Selection([
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
        ('cancelled', 'Cancelled'),
    ], string='State', default='new', tracking=True)
    active = fields.Boolean(default=True)

    @api.model_create_multi
    def create(self, vals_list):
        records = super().create(vals_list)
        for record in records:
            if record.name == 'New':
                record.name = f'CONTACT-{record.id:05d}'
        return records
