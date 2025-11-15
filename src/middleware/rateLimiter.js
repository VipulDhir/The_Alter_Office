const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const cache = require('./cache');

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => cache.client.sendCommand(args)
  }),
  windowMs: 60 * 1000,
  max: 300,
  keyGenerator: (req) => req.header('api-key') || req.ip,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = limiter;
