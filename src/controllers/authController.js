const { ApiKey } = require('../models');
const crypto = require('crypto');
const cfg = require('../config/config');

function hashKey(raw) {
  return crypto.createHmac('sha256', cfg.apiKeyHashSalt)
    .update(raw)
    .digest('hex');
}

async function generateApiKey(req, res) {
  const { appName, ownerEmail, expiresInDays } = req.body;
  if (!appName) return res.status(400).json({ error: 'appName required' });

  const rawKey = crypto.randomBytes(32).toString('hex');
  const apiKeyHash = hashKey(rawKey);

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 86400000)
    : null;

  const rec = await ApiKey.create({
    appName,
    ownerEmail,
    apiKeyHash,
    expiresAt,
    revoked: false
  });

  return res.json({
    appId: rec.id,
    apiKey: rawKey,
    expiresAt
  });
}

async function getApiKey(req, res) {
  
  res.json({
    appId: req.api.appId,
    appName: req.api.appName,
    ownerEmail: req.api.ownerEmail
  });
}

async function revokeApiKey(req, res) {
  const { appId } = req.body;
  if (!appId) return res.status(400).json({ error: 'appId required' });

  const rec = await ApiKey.findByPk(appId);
  if (!rec) return res.status(404).json({ error: 'app not found' });

  rec.revoked = true;
  await rec.save();

  res.json({ ok: true });
}

module.exports = {
  generateApiKey,
  getApiKey,
  revokeApiKey
};
