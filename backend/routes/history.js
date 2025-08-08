const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/', historyController.getHistory);
router.get('/:id', historyController.getHistoryById);
router.post('/', historyController.saveHistory);
router.delete('/:id', historyController.deleteHistory);

module.exports = router;
