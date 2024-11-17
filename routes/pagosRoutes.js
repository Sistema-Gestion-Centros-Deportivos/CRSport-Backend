const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');
const { iniciarPago, confirmarPago, resultadoPago } = require('../controllers/pagosController');

/**
 * @swagger
 * /pagos/iniciar:
 *   post:
 *     summary: Inicia un proceso de pago para una reserva
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *                 description: ID del usuario que realiza el pago
 *                 example: 1
 *               reservaId:
 *                 type: integer
 *                 description: ID de la reserva asociada al pago
 *                 example: 15
 *               monto:
 *                 type: number
 *                 description: Monto total del pago
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Pago iniciado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL a la que se debe redirigir al usuario para completar el pago
 *                   example: https://webpay3gint.transbank.cl/webpayserver/initTransaction
 *                 token:
 *                   type: string
 *                   description: Token único generado para la transacción
 *                   example: 01ab12679fba08cc9442adb3cf5d32f9c73f5b17bbd883f28242dd62d32e96cc
 *       500:
 *         description: Error al iniciar el pago
 */
router.post('/iniciar', iniciarPago);

/**
 * @swagger
 * /pagos/confirmar:
 *   get:
 *     summary: Confirmar un pago realizado
 *     tags: [Pagos]
 *     parameters:
 *       - in: query
 *         name: token_ws
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de la transacción
 *     responses:
 *       200:
 *         description: Pago confirmado exitosamente
 *       400:
 *         description: Error en la confirmación del pago
 *       500:
 *         description: Error interno del servidor
 */
router.get('/confirmar', confirmarPago);

module.exports = router;


/**
 * @swagger
 * /pagos/resultado:
 *   get:
 *     summary: Ver el resultado de una transacción
 *     tags: [Pagos]
 */
router.get('/resultado', resultadoPago);

module.exports = router;
