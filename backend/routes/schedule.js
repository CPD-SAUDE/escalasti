const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/:year/:month', scheduleController.getScheduleByMonth);
router.post('/', scheduleController.addOrUpdateScheduleEntry);
router.delete('/:id', scheduleController.deleteScheduleEntry); // Opcional: para remover entradas específicas

module.exports = router;
