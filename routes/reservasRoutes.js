// reservasRoutes.js
const express = require('express');
const router = express.Router();
const { crearReserva, actualizarReserva, eliminarReserva, obtenerReservas, obtenerReserva } = require('../controllers/reservasController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Reserva:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la reserva
 *           example: 1
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario que hizo la reserva
 *           example: 2
 *         instalacion_id:
 *           type: integer
 *           description: ID de la instalación reservada
 *           example: 3
 *         instalacion_nombre:
 *           type: string
 *           description: Nombre de la instalación reservada
 *           example: "Sala de Conferencias"
 *         fecha_reserva:
 *           type: string
 *           format: date
 *           description: Fecha de la reserva
 *           example: "2024-09-25"
 *         bloque_tiempo_id:
 *           type: integer
 *           description: ID del bloque de tiempo asociado a la reserva
 *           example: 1
 *         bloque:
 *           type: integer
 *           description: Número del bloque de tiempo
 *           example: 1
 *         hora_inicio:
 *           type: string
 *           format: time
 *           description: Hora de inicio del bloque de tiempo
 *           example: "08:00:00"
 *         hora_fin:
 *           type: string
 *           format: time
 *           description: Hora de fin del bloque de tiempo
 *           example: "08:45:00"
 *         estado_id:
 *           type: integer
 *           description: ID del estado de la reserva
 *           example: 1
 *         estado_nombre:
 *           type: string
 *           description: Nombre del estado de la reserva
 *           example: "Confirmada"
 */

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 description: ID del usuario
 *                 example: 19
 *               instalacion_bloque_semanal_id:
 *                 type: integer
 *                 description: ID del bloque semanal de la instalación
 *                 example: 1
 *               fecha_reserva:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la reserva
 *                 example: 2024-10-21
 *               estado_id:
 *                 type: integer
 *                 description: ID del estado de la reserva
 *                 example: 2
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear la reserva
 */
router.post('/', crearReserva);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 *       500:
 *         description: Error al obtener las reservas
 */
// Obtener todas las reservas
router.get('/', authenticateToken, obtenerReservas);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error al obtener la reserva
 */
router.get('/:id', authenticateToken, obtenerReserva);


/**
 * @swagger
 * /reservas/{id}:
 *   patch:
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
 *               bloque_tiempo_id:
 *                 type: integer
 *               estado_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reserva actualizada exitosamente
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error al actualizar la reserva
 */
router.patch('/:id', authenticateToken, actualizarReserva);

/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Eliminar una reserva
 *     tags: [Reservas]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva eliminada exitosamente
 *                 reserva:
 *                   type: object
 *                   description: Detalles de la reserva eliminada
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error al eliminar la reserva
 */
router.delete('/:id', eliminarReserva);

module.exports = router;
