const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');
const { authenticateToken } = require('../middlewares/authMiddleware');


/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Endpoints para gestionar reservas
 */

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instalacion_id:
 *                 type: integer
 *               fecha_reserva:
 *                 type: string
 *                 format: date
 *               hora_inicio:
 *                 type: string
 *                 format: time
 *               hora_fin:
 *                 type: string
 *                 format: time
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *       400:
 *         description: Todos los campos son obligatorios
 *       500:
 *         description: Error al crear la reserva
 */
// Crear una nueva reserva
router.post('/', authenticateToken, reservasController.crearReserva);


/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas obtenida correctamente
 *       500:
 *         description: Error al obtener las reservas
 */
// Obtener todas las reservas
router.get('/', authenticateToken, reservasController.obtenerReservas);


/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Obtener una reserva por ID
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la reserva a obtener
 *     responses:
 *       200:
 *         description: Reserva obtenida correctamente
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error al obtener la reserva
 */
// Obtener una reserva por ID
router.get('/:id', authenticateToken, reservasController.obtenerReserva);


/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Actualizar una reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la reserva a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instalacion_id:
 *                 type: integer
 *               fecha_reserva:
 *                 type: string
 *                 format: date
 *               hora_inicio:
 *                 type: string
 *                 format: time
 *               hora_fin:
 *                 type: string
 *                 format: time
 *               estado_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reserva actualizada correctamente
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error al actualizar la reserva
 */
// Actualizar una reserva
router.put('/:id', authenticateToken, reservasController.actualizarReserva);


/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Eliminar una reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la reserva a eliminar
 *     responses:
 *       200:
 *         description: Reserva eliminada correctamente
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error al eliminar la reserva
 */
// Eliminar una reserva
router.delete('/:id', authenticateToken, reservasController.eliminarReserva);

module.exports = router;
