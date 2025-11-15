const router = require('express').Router();
const apiKeyAuth = require('../middleware/apiKeyAuth');
const limiter = require('../middleware/rateLimiter');
const { collectEvent, eventSummary, userStats } = require('../controllers/analyticsController');

router.post('/collect', limiter, apiKeyAuth, collectEvent);
router.get('/event-summary', limiter, apiKeyAuth, eventSummary);
router.get('/user-stats', limiter, apiKeyAuth, userStats);

module.exports = router;
