const express = require('express');
const router = express.Router();
const professionalsController = require('../controllers/professionalsController');

router.post('/', professionalsController.addProfessional);
router.get('/', professionalsController.getAllProfessionals);
router.put('/:id', professionalsController.updateProfessional);
router.delete('/:id', professionalsController.deleteProfessional);

module.exports = router;
