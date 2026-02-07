require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USER || "postgres",
    "password": process.env.DB_PASSWORD || "postgres",
    "database": process.env.DB_NAME || "canteen",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USER || "postgres",
    "password": process.env.DB_PASSWORD || "postgres",
    "database": process.env.DB_NAME || "canteen",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "username": process.env.DB_USER || "postgres",
    "password": process.env.DB_PASSWORD || "postgres",
    "database": process.env.DB_NAME || "canteen",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}