# Canteen Backend API

A TypeScript-based REST API for a canteen/food ordering system built with Express, Prisma, and SQLite.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migration and seed
npm run db:migrate

# Start development server
npm run dev
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts           # Seed data script
│   └── migrations/       # Database migrations
├── src/
│   ├── lib/
│   │   └── prisma.ts     # Prisma client singleton
│   └── types/
│       └── index.ts      # TypeScript type definitions
├── server.ts             # Express server entry point
├── package.json
├── tsconfig.json
└── .env                  # Environment variables
```

## 🗄️ Database Models

The application uses 8 main models:

1. **User** - User accounts with role-based access (USER/ADMIN)
2. **RefreshToken** - JWT refresh token management
3. **Category** - Menu item categories (Breakfast, Lunch, etc.)
4. **MenuItem** - Food items with pricing and stock
5. **CartItem** - Shopping cart items
6. **Order** - Placed orders with status tracking
7. **OrderItem** - Individual items within orders
8. **Payment** - Payment information and status

See [MODELS.md](./MODELS.md) for detailed documentation.

## 🔑 Default Credentials

After seeding the database:

- **Admin**: `admin@canteen.com` / `admin123`
- **User**: `user@canteen.com` / `user123`

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server with ts-node

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database with test data
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:generate  # Generate Prisma Client

# Production
npm run build        # Compile TypeScript
npm start           # Run compiled JavaScript
```

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **Auth**: bcrypt for password hashing (JWT coming soon)
- **Validation**: TypeScript types (Zod integration planned)

## 📋 API Endpoints (Planned)

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and invalidate tokens

### Menu
- `GET /api/menus` - List all menu items (with filters)
- `GET /api/menus/:id` - Get menu item details
- `POST /api/menus` - Create menu item (admin)
- `PUT /api/menus/:id` - Update menu item (admin)
- `DELETE /api/menus/:id` - Delete menu item (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Place order from cart
- `PUT /api/orders/:id/status` - Update order status (admin)
- `POST /api/orders/:id/pay` - Process payment

### Admin
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/users` - List all users
- `GET /api/admin/stats` - Dashboard statistics

## 🔐 Environment Variables

```env
DATABASE_URL="file:./dev.db"
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## 📊 Database Schema Highlights

- **UUIDs** for all primary keys
- **Price in cents** to avoid floating-point issues
- **Price snapshots** in cart/orders to preserve historical pricing
- **Cascade deletes** for data consistency
- **Unique constraints** to prevent duplicate cart items
- **Enums** for order status, payment methods, user roles

## 🚧 Next Steps

- [ ] Implement authentication middleware (JWT)
- [ ] Create REST API controllers and routes
- [ ] Add request validation (Zod)
- [ ] Implement rate limiting
- [ ] Add pagination for list endpoints
- [ ] Write unit and integration tests
- [ ] Set up Docker and docker-compose
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement logging and error handling

## 📖 Documentation

- [Database Models](./MODELS.md) - Detailed model documentation with examples
- TypeScript types are in `src/types/index.ts`

## 🐛 Troubleshooting

### Migration Issues
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client
npm run db:generate
```

### Port Already in Use
Change the `PORT` in `.env` file or kill the process using port 5000:
```bash
lsof -ti:5000 | xargs kill -9
```

## 📝 License

ISC

---

**Status**: Database models and schema complete ✅  
**Next**: Implement authentication and REST API endpoints
