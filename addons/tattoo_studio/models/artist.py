# -*- coding: utf-8 -*-

from odoo import models, fields, api

class TattooArtist(models.Model):
    """
    Modelo para gestionar tatuadores del estudio
    Incluye perfil, habilidades y portafolio
    """
    _name = 'tattoo.artist'
    _description = 'Tattoo Artist'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    # Información personal
    name = fields.Char(string='Artist Name', required=True, track_visibility='onchange')
    email = fields.Char(string='Email')
    phone = fields.Char(string='Phone')
    
    # Información profesional
    specialization = fields.Char(string='Specialization')
    biography = fields.Html(string='Biography')
    years_of_experience = fields.Integer(string='Years of Experience')
    image_1920 = fields.Image(string='Artist Photo')
    
    # Habilidades
    skill_ids = fields.Many2many('tattoo.skill', 'artist_skill_rel', 'artist_id', 'skill_id', string='Skills')
    
    # Servicios que ofrece
    service_ids = fields.Many2many('tattoo.service', 'tattoo_service_artist_rel', 'artist_id', 'service_id', string='Services')
    
    # Portafolio
    portfolio_image_ids = fields.One2many('tattoo.portfolio.image', 'artist_id', string='Portfolio Images')
    gallery_image_ids = fields.One2many('tattoo.artist.gallery', 'artist_id', string='Gallery Images')
    
    # Relaciones
    appointment_ids = fields.One2many('tattoo.appointment', 'artist_id', string='Appointments')
    review_ids = fields.One2many('tattoo.review', 'artist_id', string='Reviews')
    
    # Estadísticas
    average_rating = fields.Float(string='Average Rating', compute='_compute_average_rating', store=True)
    total_reviews = fields.Integer(string='Total Reviews', compute='_compute_total_reviews', store=True)
    total_completed_appointments = fields.Integer(string='Completed Appointments', compute='_compute_total_completed', store=True)
    
    # Disponibilidad y horarios
    is_available = fields.Boolean(string='Available for Appointments', default=True)
    availability_ids = fields.One2many('tattoo.artist.availability', 'artist_id', string='Availability Schedule')
    exception_ids = fields.One2many('tattoo.exception', 'artist_id', string='Exceptions')
    working_hours = fields.Text(string='Working Hours')
    
    # Estado
    active = fields.Boolean(default=True)

    @api.depends('review_ids.rating')
    def _compute_average_rating(self):
        """Calcula el rating promedio del artista"""
        for artist in self:
            ratings = artist.review_ids.mapped('rating')
            artist.average_rating = sum(ratings) / len(ratings) if ratings else 0.0

    @api.depends('review_ids')
    def _compute_total_reviews(self):
        """Cuenta el total de reseñas"""
        for artist in self:
            artist.total_reviews = len(artist.review_ids)

    @api.depends('appointment_ids')
    def _compute_total_completed(self):
        """Cuenta citas completadas"""
        for artist in self:
            artist.total_completed_appointments = len(artist.appointment_ids.filtered(lambda a: a.state == 'done'))

    def get_artist_profile(self):
        """Retorna perfil del artista en formato JSON para API"""
        return {
            'id': self.id,
            'name': self.name,
            'specialization': self.specialization,
            'experience': f'{self.years_of_experience} years',
            'rating': self.average_rating,
            'reviewCount': self.total_reviews,
            'biography': self.biography or '',
            'skills': [skill.name for skill in self.skill_ids],
            'portfolio': [img.image_url for img in self.portfolio_image_ids],
            'gallery': [
                {
                    'id': image.id,
                    'name': image.name or '',
                    'type': image.tattoo_type or '',
                    'description': image.description or '',
                    'image': image.image_url or '',
                    'work_date': image.work_date.isoformat() if image.work_date else '',
                }
                for image in self.gallery_image_ids
            ],
            'available': self.is_available,
            'image': f'/web/image/tattoo.artist/{self.id}/image_1920' if self.image_1920 else '',
        }


class TattooSkill(models.Model):
    """
    Modelo para habilidades de tatuadores
    """
    _name = 'tattoo.skill'
    _description = 'Tattoo Skill'

    name = fields.Char(string='Skill Name', required=True)
    description = fields.Text(string='Description')
    
    artist_ids = fields.Many2many('tattoo.artist', 'artist_skill_rel', 'skill_id', 'artist_id', string='Artists')


class TattooPortfolioImage(models.Model):
    """
    Modelo para imágenes del portafolio de artistas
    """
    _name = 'tattoo.portfolio.image'
    _description = 'Tattoo Artist Portfolio Image'

    name = fields.Char(string='Image Title')
    artist_id = fields.Many2one('tattoo.artist', string='Artist', required=True, ondelete='cascade')
    
    # Imagen
    image = fields.Image(string='Image', required=True)
    image_url = fields.Char(string='Image URL', compute='_compute_image_url', store=True)
    
    # Información
    description = fields.Text(string='Description')
    tattoo_type = fields.Selection([
        ('new', 'New Tattoo'),
        ('cover', 'Cover'),
        ('modification', 'Modification'),
        ('touch', 'Touch Up')
    ], string='Tattoo Type')
    
    # Orden de visualización
    sequence = fields.Integer(string='Sequence', default=10)

    @api.depends('image')
    def _compute_image_url(self):
        """Genera URL de imagen"""
        for image in self:
            if image.image:
                image.image_url = f'/web/image/tattoo.portfolio.image/{image.id}/image'
            else:
                image.image_url = ''
