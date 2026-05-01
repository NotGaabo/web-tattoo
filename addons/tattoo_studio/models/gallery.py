# -*- coding: utf-8 -*-

from odoo import api, fields, models


class TattooArtistGallery(models.Model):
    _name = 'tattoo.artist.gallery'
    _description = 'Tattoo Artist Gallery'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'sequence, id desc'

    name = fields.Char(string='Work Title', required=True)
    artist_id = fields.Many2one(
        'tattoo.artist',
        string='Artist',
        required=True,
        ondelete='cascade',
        index=True,
    )
    tattoo_type = fields.Selection([
        ('realism', 'Realism'),
        ('traditional', 'Traditional'),
        ('neo_traditional', 'Neo Traditional'),
        ('blackwork', 'Blackwork'),
        ('minimalism', 'Minimalism'),
        ('watercolor', 'Watercolor'),
        ('japanese', 'Japanese'),
        ('lettering', 'Lettering'),
        ('cover_up', 'Cover Up'),
        ('geometric', 'Geometric'),
        ('other', 'Other'),
    ], string='Tattoo Style', required=True, tracking=True)
    description = fields.Text(string='Description')
    work_date = fields.Date(string='Work Date', default=fields.Date.context_today)
    image = fields.Image(string='Work Photo', required=True)
    image_url = fields.Char(string='Image URL', compute='_compute_image_url', store=True)
    sequence = fields.Integer(string='Sequence', default=10)
    active = fields.Boolean(default=True)

    @api.depends('image')
    def _compute_image_url(self):
        for item in self:
            item.image_url = f'/web/image/tattoo.artist.gallery/{item.id}/image' if item.image else ''
