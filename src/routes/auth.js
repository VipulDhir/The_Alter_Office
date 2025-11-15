const router = require('express').Router();
const { generateApiKey, getApiKey, revokeApiKey } = require('../controllers/authController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

router.post('/register', generateApiKey);

router.get('/api-key', apiKeyAuth, getApiKey);
router.post('/revoke', apiKeyAuth, revokeApiKey);

module.exports = router;
