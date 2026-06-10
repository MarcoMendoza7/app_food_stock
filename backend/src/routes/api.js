const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const foodController = require('../controllers/foodController');
const moveController = require('../controllers/moveController');

// Rutas de autenticación y creación de cuentas
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// Rutas del CRUD de alimentos
router.get('/alimentos', foodController.getAll);
router.post('/alimentos', foodController.create);
router.put('/alimentos/:id', foodController.update);
router.delete('/alimentos/:id', foodController.delete);

// Rutas del Historial de movimientos
router.get('/movimientos', moveController.getAll);
router.post('/movimientos', moveController.create);

module.exports = router;