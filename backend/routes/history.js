const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.post('/', historyController.saveSchedule);
router.get('/', historyController.getHistory);
router.delete('/:id', historyController.deleteHistoryEntry);

module.exports = router;
