const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/', historyController.getAllHistory);
router.get('/:year/:month', historyController.getHistoryByMonth);
router.post('/', historyController.addHistoryEntry);
router.delete('/:id', historyController.deleteHistoryEntry); // Opcional: para remover entradas específicas

module.exports = router;
