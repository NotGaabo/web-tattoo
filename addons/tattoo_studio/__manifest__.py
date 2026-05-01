{
    'name': 'Tattoo Studio Management',
    'version': '1.0.0',
    'category': 'Sales',
    'summary': 'Complete management system for tattoo studio operations',
    'description': """
        Tattoo Studio Management Module
        ================================
        
        This module provides complete functionality for managing:
        - Products (supplements and aftercare items)
        - Services (tattoo designs in different sizes)
        - Customers and Orders
        - Tattoo Artists and their portfolios
        - Reviews and Ratings
        - Appointments scheduling
    """,
    'author': 'Tattoo Studio',
    'sequence':5,
    'website': 'https://tattoostudio.com',
    'depends': ['base', 'sale', 'stock', 'purchase', 'product', 'auth_signup'],
    'installable': True,
    'auto_install': False,
    'application': True,
    'data': [
        # Security
        'security/ir.model.access.csv',
        
        # Data
        'data/tattoo_studio_data.xml',
        
        # Views
        'views/customer_views.xml',
        'views/product_views.xml',
        'views/service_views.xml',
        'views/artist_views.xml',
        'views/gallery_views.xml',
        'views/availability_views.xml',
        'views/exception_views.xml',
        'views/order_views.xml',
        'views/appointment_views.xml',
        'views/review_views.xml',
        'views/menu_views.xml',
    ],
    'qweb': [],
    'images': ['static/description/icon.png'],
    'license': 'LGPL-3',
    'external_dependencies': {
        'python': [],
        'bin': []
    }
}
