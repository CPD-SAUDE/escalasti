const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.post('/', historyController.addHistoryEntry);
router.get('/', historyController.getAllHistory);
// router.delete('/:id', historyController.deleteHistoryEntry); // Opcional

module.exports = router;
