# -*- coding: utf-8 -*-

from odoo import models, fields

class TattooArtistAvailability(models.Model):
    _name = 'tattoo.artist.availability'
    _description = 'Artist Availability Schedule'

    artist_id = fields.Many2one('tattoo.artist', string='Artist', required=True, ondelete='cascade')
    day_of_week = fields.Selection([
        ('0', 'Monday'),
        ('1', 'Tuesday'),
        ('2', 'Wednesday'),
        ('3', 'Thursday'),
        ('4', 'Friday'),
        ('5', 'Saturday'),
        ('6', 'Sunday'),
    ], string='Day of Week', required=True)
    start_time = fields.Float(string='Start Time', required=True)
    end_time = fields.Float(string='End Time', required=True)
    active = fields.Boolean(default=True)

    _sql_constraints = [
        ('unique_artist_day', 'unique(artist_id, day_of_week)', 'An artist can only have one availability per day of the week.'),
    ]