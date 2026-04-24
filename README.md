# Tattoo Studio Project

Complete ecommerce and management system for a tattoo studio with React frontend and Odoo backend.

## Project Structure

```
web-tatoo/
├── src/                    # React frontend source
│   ├── components/         # Reusable React components
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   ├── context/            # Zustand state management
│   ├── styles/             # Global styling
│   └── App.jsx
├── odoo-module/            # Odoo 19 module
│   └── tattoo_studio/      # Main module directory
│       ├── models/         # Data models
│       ├── views/          # XML view definitions
│       ├── security/       # Access control rules
│       ├── data/           # Sample data and fixtures
│       └── __manifest__.py # Module metadata
├── config/                 # Configuration files
│   └── odoo.conf          # Odoo configuration
├── postgres_config/        # PostgreSQL configuration
│   └── init.sql           # Database initialization
├── docker-compose.yml      # Docker services orchestration
├── vite.config.js         # Vite bundler configuration
├── package.json           # Frontend dependencies
└── index.html             # Entry HTML file
```

## Features

### Frontend (React + Vite)

- **Product Catalog**: Browse supplements with filtering and sorting
- **Shopping Cart**: Add/remove items, manage quantities
- **Service Booking**: Tattoo services with size categories and artist selection
- **Artist Profiles**: View artists with portfolio and book appointments
- **Review System**: Rate products, services, and artists
- **Checkout**: Multi-step form with payment method selection
- **Responsive Design**: Mobile-friendly UI with animations

### Backend (Odoo 19)

- **Customer Management**: Customer profiles with purchase history
- **Product Inventory**: Aftercare products with pricing and stock
- **Service Management**: Tattoo services with pricing and duration
- **Artist Profiles**: Artist information with skills and portfolio
- **Order Processing**: Complete order lifecycle management
- **Appointment Booking**: Schedule appointments with artists
- **Review Management**: Moderation and display of customer reviews
- **Access Control**: User and manager roles with appropriate permissions

## Installation & Setup

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for frontend development)
- Git

### Quick Start with Docker

1. **Clone the repository**

   ```bash
   cd web-tatoo
   ```

2. **Build and start services**

   ```bash
   docker-compose up -d
   ```

3. **Initialize Odoo database**
   - Wait for services to be healthy (check logs: `docker-compose logs`)
   - Navigate to http://localhost:8000
   - Create master password and complete setup wizard

4. **Install the Tattoo Studio module**
   - Go to Apps section
   - Search for "Tattoo Studio"
   - Click Install

5. **Frontend development**
   ```bash
   npm install
   npm run dev
   ```

   - Access at http://localhost:3000

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

## API Integration

The frontend communicates with Odoo through the following endpoints:

- `GET /api/products` - List all products
- `GET /api/services` - List all services
- `GET /api/artists` - List all artists
- `POST /api/orders` - Create new order
- `POST /api/appointments` - Book appointment
- `POST /api/reviews` - Submit review

## Docker Services

### PostgreSQL (tattoo_db)

- Port: 5432
- User: odoo
- Password: odoo_password_123
- Database: tattoo_studio

### Odoo (tattoo_odoo)

- Port: 8000 (web interface)
- Port: 8072 (websocket)
- Admin User: admin
- Admin Password: admin

## Development

### Frontend Development

```bash
# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development

1. **Access Odoo console**

   ```bash
   docker-compose exec odoo bash
   ```

2. **Module installation**

   ```bash
   odoo-bin -d tattoo_studio -i tattoo_studio --without-demo=all
   ```

3. **View logs**
   ```bash
   docker-compose logs -f odoo
   ```

## Testing

### Frontend

```bash
npm run test
```

### Backend (Odoo)

Navigate to Odoo admin panel -> Apps -> Tattoo Studio -> Run Tests

## Database Management

### Access PostgreSQL

```bash
docker-compose exec db psql -U odoo -d tattoo_studio
```

### Backup Database

```bash
docker-compose exec db pg_dump -U odoo tattoo_studio > backup.sql
```

### Restore Database

```bash
docker-compose exec -T db psql -U odoo tattoo_studio < backup.sql
```

## Deployment

### Production Build

1. **Build frontend**

   ```bash
   npm run build
   ```

2. **Update docker-compose.yml**
   - Change `workers = 4` to higher value in odoo.conf
   - Set `list_db = False` for security
   - Update environment variables

3. **Deploy**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

## Troubleshooting

### Port Already in Use

```bash
# Change ports in docker-compose.yml
# Frontend: Change port 3000 to 3001
# Odoo: Change port 8000 to 8001
# PostgreSQL: Change port 5432 to 5433
```

### Database Connection Issues

```bash
# Check logs
docker-compose logs db odoo

# Restart services
docker-compose restart
```

### Module Not Found

```bash
# Ensure module path is correct in docker-compose.yml
# Restart Odoo with updated addons path
docker-compose restart odoo
```

## API Documentation

### Product Service

```javascript
import { productService } from "@/services/api";

// Get all products
const products = await productService.getAll();

// Get specific product
const product = await productService.getById(productId);

// Create product (admin only)
await productService.create({
  name: "Product Name",
  brand: "Brand",
  price: 19.99,
  description: "Description",
});
```

### Service Service

```javascript
import { serviceService } from "@/services/api";

// Get all services
const services = await serviceService.getAll();

// Get specific service
const service = await serviceService.getById(serviceId);
```

### Order Service

```javascript
import { orderService } from "@/services/api";

// Create order
const order = await orderService.create({
  customer_id: customerId,
  items: [{ product_id: productId, quantity: 1 }],
  payment_method: "transfer",
});

// Get user orders
const orders = await orderService.getUserOrders(userId);
```

### Appointment Service

```javascript
import { appointmentService } from "@/services/api";

// Get available time slots
const availability = await appointmentService.getAvailable(artistId);

// Book appointment
const appointment = await appointmentService.create({
  artist_id: artistId,
  service_id: serviceId,
  appointment_datetime: "2024-01-15 14:00:00",
  customer_notes: "Design ideas...",
});
```

### Review Service

```javascript
import { reviewService } from "@/services/api";

// Get reviews
const reviews = await reviewService.getByItem(itemId, "product");

// Create review
await reviewService.create({
  review_type: "product",
  product_id: productId,
  rating: 5,
  comment: "Great product!",
  title: "Excellent",
});
```

## Security Considerations

1. **API Authentication**: Implement token-based auth for API endpoints
2. **Input Validation**: All form inputs are validated client and server-side
3. **CORS**: Configure appropriate CORS policies
4. **Database**: Use strong passwords and secure connections
5. **Secrets**: Never commit .env files with real credentials

## License

This project is proprietary and confidential.

## Support

For issues and questions, contact the development team.
