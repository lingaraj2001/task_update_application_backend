const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const authMiddleware = require('../utils/auth.middleware');

router.post('/suggest', authMiddleware, aiController.suggestTaskDetails);

module.exports = router;
