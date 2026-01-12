const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, doctorController.createDoctor);
router.get('/', doctorController.getDoctors);
router.put('/:id', auth, doctorController.updateDoctor);
router.delete('/:id', auth, doctorController.deleteDoctor);

module.exports = router;