const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/', historyController.getAllHistory);
router.post('/', historyController.addHistoryEntry);
router.delete('/:id', historyController.deleteHistoryEntry);

module.exports = router;
