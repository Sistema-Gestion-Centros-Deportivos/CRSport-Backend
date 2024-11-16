const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');

/**
 * @swagger
 * /pagos/iniciar:
 *   post:
 *     summary: Inicia una transacción de pago con Webpay Plus
 *     tags: [Pagos]
 */
router.post('/iniciar', pagosController.iniciarPago);

/**
 * @swagger
 * /pagos/confirmacion:
 *   post:
 *     summary: Confirmar una transacción de pago
 *     tags: [Pagos]
 */
router.post('/confirmacion', pagosController.confirmarPago);

/**
 * @swagger
 * /pagos/resultado:
 *   get:
 *     summary: Ver el resultado de una transacción
 *     tags: [Pagos]
 */
router.get('/resultado', pagosController.resultadoPago);

module.exports = router;
