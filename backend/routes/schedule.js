const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.post('/', scheduleController.addOrUpdateScheduleEntry);
router.get('/:year/:month', scheduleController.getScheduleByMonth);
// router.get('/:id', scheduleController.getScheduleEntryById); // Opcional
// router.delete('/:id', scheduleController.deleteScheduleEntry); // Opcional

module.exports = router;
