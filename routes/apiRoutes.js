const {Router} = require('express')
const UrlController = require('../controllers/UrlController');
const analyticsController = require('../controllers/AnalyticsController');
const rateLimit = require('express-rate-limit');
const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: 'Too many requests from this IP, please try again later.',
});

router.post('/shorten',limiter,UrlController.shortenUrl);
router.get('/:shortCode',analyticsController.urlRedirect);
router.get('/analytics/:shortCode',analyticsController.dataAnalysis);

module.exports = router;