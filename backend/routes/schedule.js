const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/', scheduleController.getSchedule);
router.put('/', scheduleController.updateScheduleEntry);
router.post('/generate', scheduleController.generateSchedule);
router.post('/clear', scheduleController.clearSchedule);

module.exports = router;
