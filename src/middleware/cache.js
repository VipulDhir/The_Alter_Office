const redis = require('redis');
const cfg = require('../config/config');
const client = redis.createClient({ url: cfg.redis.url });
client.connect();

module.exports = {
  get: async (k) => {
    try { return await client.get(k); } catch(e){ return null; }
  },
  set: async (k, v, ttlSec = 60) => {
    try { await client.set(k, v, { EX: ttlSec }); } catch(e) {}
  },
  client
};
