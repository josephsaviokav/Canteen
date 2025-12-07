# Canteen Backend Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Quick Setup

### Option 1: Automatic Setup (Linux/macOS)

```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create PostgreSQL database**
   ```bash
   sudo -u postgres psql
   ```
   
   Inside psql:
   ```sql
   CREATE DATABASE canteen;
   CREATE USER postgres WITH PASSWORD 'postgres';
   GRANT ALL PRIVILEGES ON DATABASE canteen TO postgres;
   \q
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```
   
   Update with your database credentials:
   ```
   DB_NAME=canteen
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_HOST=127.0.0.1
   DB_PORT=5432
   ```

4. **Run migrations**
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Verify setup**
   ```bash
   psql -U postgres -d canteen -c "\dt"
   ```
   
   You should see: `users`, `items`, `orders`, `orderItems` tables.

## Database Schema

### Tables Created:

1. **users** - User accounts (admin/customer)
   - id (UUID), firstName, lastName, email, password, phone, role

2. **items** - Menu items
   - id (UUID), name, price, imageUrl, available

3. **orders** - Customer orders
   - id (UUID), userId, totalAmount, status

4. **orderItems** - Items in each order
   - id (UUID), orderId, itemId, quantity, price, subTotal

## Troubleshooting

### PostgreSQL Connection Error
```bash
# Start PostgreSQL service
sudo systemctl start postgresql
```

### Migration Errors
```bash
# Reset migrations
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

### Database Already Exists
```bash
# Drop and recreate
sudo -u postgres psql -c "DROP DATABASE canteen;"
sudo -u postgres psql -c "CREATE DATABASE canteen;"
npx sequelize-cli db:migrate
```

## Development

```bash
npm run dev    # Start development server
npm run build  # Build TypeScript
npm start      # Start production server
```

## Project Structure

```
backend/
├── config/
│   └── config.js         # Sequelize CLI config
├── migrations/           # Database migrations
├── src/
│   ├── config/
│   │   └── database.ts   # Database connection
│   └── models/           # Sequelize models
│       ├── User.ts
│       ├── Item.ts
│       ├── Order.ts
│       └── OrderItem.ts
├── .env                  # Environment variables
└── schema.json          # Database schema documentation
```
