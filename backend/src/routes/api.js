const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const foodController = require('../controllers/foodController');
const moveController = require('../controllers/moveController');

router.post('/auth/login', authController.login);

router.get('/alimentos', foodController.getAll);
router.post('/alimentos', foodController.create);
router.put('/alimentos/:id', foodController.update);
router.delete('/alimentos/:id', foodController.delete);

router.get('/movimientos', moveController.getAll);
router.post('/movimientos', moveController.create);

module.exports = router;