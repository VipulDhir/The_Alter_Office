require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8080,
  db: {
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'analytics',
    host: process.env.POSTGRES_HOST || 'db',
    dialect: 'postgres'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://redis:6379'
  },
  apiKeyHashSalt: process.env.API_KEY_SALT || 'some-secret-salt'
};
