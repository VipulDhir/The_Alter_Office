require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8080,
  db: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '< MySQL Password >',
    database: process.env.MYSQL_DB || 'analytics',
    host: process.env.MYSQL_HOST || 'db',
    dialect: 'mysql'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://redis:6379'
  },
  apiKeyHashSalt: process.env.API_KEY_SALT || 'some-secret-salt'
};
