const express = require('express');
const { getAnalytics } = require('../controllers/adminController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/analytics', auth, adminOnly, getAnalytics);

module.exports = router;
