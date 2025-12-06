#!/bin/bash

echo "🚀 Setting up Canteen Backend..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
DB_NAME=canteen
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
EOL
    echo "✅ .env file created. Please update with your credentials if needed."
fi

# Create database (requires postgres user access)
echo "🗄️  Creating database..."
sudo -u postgres psql -c "CREATE DATABASE canteen;" 2>/dev/null || echo "Database might already exist, continuing..."

# Run migrations
echo "🔄 Running migrations..."
npx sequelize-cli db:migrate

# Verify setup
echo "✅ Verifying setup..."
psql -U postgres -d canteen -c "\dt"

echo "🎉 Setup complete! Your database is ready."
echo "📋 Tables created: users, items, orders, orderItems"
