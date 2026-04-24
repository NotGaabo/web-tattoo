# -*- coding: utf-8 -*-

from odoo import fields, models


class ResUsers(models.Model):
    _inherit = 'res.users'

    api_token = fields.Char(string='API Token', copy=False, index=True)
