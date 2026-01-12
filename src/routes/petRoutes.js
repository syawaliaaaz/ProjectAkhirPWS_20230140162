const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, petController.createPet);
router.get('/', auth, petController.getPets);
router.put('/:id', auth, petController.updatePet);
router.delete('/:id', auth, petController.deletePet);

module.exports = router;