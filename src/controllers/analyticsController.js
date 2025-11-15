const { Event, sequelize } = require('../models');
const { Op } = require('sequelize');
const cache = require('../middleware/cache');

async function collectEvent(req, res) {
  try {
    const payload = req.body;
    if (!payload.event || !payload.timestamp) {
      return res.status(400).json({ error: 'event and timestamp required' });
    }

    await Event.create({
      appId: req.api.appId,
      eventType: payload.event,
      url: payload.url,
      referrer: payload.referrer,
      device: payload.device,
      ipAddress: payload.ipAddress,
      userId: payload.userId,
      userAgent: payload.userAgent,
      metadata: payload.metadata || {},
      createdAt: new Date(payload.timestamp),
      receivedAt: new Date()
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

async function eventSummary(req, res) {
  try {
    const { event, startDate, endDate, app_id } = req.query;

    if (!event) {
      return res.status(400).json({ error: "event parameter is required" });
    }

    const where = { eventType: event };

    if (startDate || endDate) where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      where.createdAt[Op.lte] = end;
    }

    where.appId = app_id || req.api.appId;

    const cacheKey = `summary:${event}:${startDate || 'none'}:${endDate || 'none'}:${where.appId}`;
    const cached = await cache.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));


    const total = await Event.count({ where });


    const uniqueUsers = await Event.count({
      where,
      distinct: true,
      col: 'userId'
    });

    const deviceRows = await Event.findAll({
      attributes: ['device', [sequelize.fn('count', sequelize.col('device')), 'cnt']],
      where,
      group: ['device']
    });

    const deviceData = {};
    deviceRows.forEach(r => deviceData[r.device || 'unknown'] = parseInt(r.get('cnt')));

    const result = {
      event,
      count: total,
      uniqueUsers,
      deviceData
    };

    await cache.set(cacheKey, JSON.stringify(result), 30);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

async function userStats(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const totalEvents = await Event.count({ where: { userId } });
    const latest = await Event.findAll({ where: { userId }, order: [['createdAt', 'DESC']], limit: 5 });
    const deviceDetails = latest.length ? { browser: latest[0].metadata?.browser, os: latest[0].metadata?.os } : {};

    res.json({ userId, totalEvents, recentEvents: latest, deviceDetails });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

module.exports = { collectEvent, eventSummary, userStats };
