# -*- coding: utf-8 -*-

from odoo import models, fields

class TattooException(models.Model):
    _name = 'tattoo.exception'
    _description = 'Studio/Artist Exception Dates'

    artist_id = fields.Many2one('tattoo.artist', string='Artist', ondelete='cascade',
                                help='Leave empty for studio-wide exceptions')
    date = fields.Date(string='Date', required=True)
    reason = fields.Char(string='Reason')
    is_closed = fields.Boolean(string='Closed', default=True,
                               help='If checked, no appointments can be made on this date')
    active = fields.Boolean(default=True)

    _sql_constraints = [
        ('unique_exception', 'unique(artist_id, date)', 'Only one exception per artist per date.'),
    ]