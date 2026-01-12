const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
// Tambahkan middleware auth jika hanya admin yang boleh edit dokter
// const auth = require('../middleware/authMiddleware'); 

router.post('/', doctorController.createDoctor);
router.get('/', doctorController.getDoctors);
router.put('/:id', doctorController.updateDoctor);
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;