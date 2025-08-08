const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.get('/status', configController.getApiStatus);

module.exports = router;
