const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/:year/:month', scheduleController.getScheduleByMonth);
router.post('/', scheduleController.addOrUpdateScheduleEntry);

module.exports = router;
