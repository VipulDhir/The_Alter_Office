const { ApiKey } = require('../models');
const cfg = require('../config/config');
const crypto = require('crypto');

async function findApiKeyByRawKey(raw) {
  const hash = crypto.createHmac('sha256', cfg.apiKeyHashSalt).update(raw).digest('hex');
  return await ApiKey.findOne({ where: { apiKeyHash: hash, revoked: false } });
}

module.exports = async function apiKeyAuth(req, res, next) {
  try {
    const key = req.header('api-key');
    if (!key) return res.status(401).json({ error: 'API key required' });
    const record = await findApiKeyByRawKey(key);
    if (!record) return res.status(401).json({ error: 'Invalid API key' });
    if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'API key expired' });
    }
    req.api = { appId: record.id, appName: record.appName, ownerEmail: record.ownerEmail };
    next();
  } catch (err) { next(err); }
};
