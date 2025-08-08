const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/:year/:month', scheduleController.getSchedule);
router.post('/', scheduleController.saveSchedule);

module.exports = router;
