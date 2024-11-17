// reservasRoutes.js
const express = require('express');
const router = express.Router();
const { crearReserva, modificarReserva, eliminarReserva, obtenerTodasLasReservas, obtenerReservasPorUsuario, obtenerReservasPorInstalacionYFecha, obtenerDisponibilidadPorRango, eliminarYLiberarReserva, contarReservasPorFecha } = require('../controllers/reservasController');
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
 *     summary: Crear una nueva reserva y marcar el bloque como no disponible
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
 *                 description: ID del usuario que realiza la reserva
 *               instalacion_bloque_periodico_id:
 *                 type: integer
 *                 description: ID del bloque de tiempo que se desea reservar
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
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
 *     responses:
 *       200:
 *         description: Lista de todas las reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reserva_id:
 *                     type: integer
 *                     description: ID de la reserva
 *                   usuario_id:
 *                     type: integer
 *                     description: ID del usuario que realizó la reserva
 *                   usuario_nombre:
 *                     type: string
 *                     description: Nombre del usuario
 *                   estado_id:
 *                     type: integer
 *                     description: ID del estado de la reserva
 *                   estado_nombre:
 *                     type: string
 *                     description: Nombre del estado de la reserva
 *                   instalacion_id:
 *                     type: integer
 *                     description: ID de la instalación reservada
 *                   instalacion_nombre:
 *                     type: string
 *                     description: Nombre de la instalación reservada
 *                   bloque_tiempo_id:
 *                     type: integer
 *                     description: ID del bloque de tiempo reservado
 *                   fecha:
 *                     type: string
 *                     format: date
 *                     description: Fecha del bloque reservado
 *                   hora_inicio:
 *                     type: string
 *                     format: time
 *                     description: Hora de inicio del bloque
 *                   hora_fin:
 *                     type: string
 *                     format: time
 *                     description: Hora de fin del bloque
 *                   creado_en:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha y hora de creación de la reserva
 *       500:
 *         description: Error al obtener las reservas
 */
router.get('/', authenticateToken, obtenerTodasLasReservas);

/**
 * @swagger
 * /reservas/{usuarioId}:
 *   get:
 *     summary: Obtener todas las reservas de un usuario
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario
 *       500:
 *         description: Error al obtener las reservas
 */
router.get('/:usuarioId', authenticateToken, obtenerReservasPorUsuario);

/**
 * @swagger
 * /reservas/instalacion/{instalacionId}/fecha/{fecha}:
 *   get:
 *     summary: Obtener todas las reservas de una instalación en una fecha específica
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: instalacionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la instalación
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha específica (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de reservas para la instalación en la fecha indicada
 *       500:
 *         description: Error al obtener las reservas
 */
router.get('/instalacion/:instalacionId/fecha/:fecha', obtenerReservasPorInstalacionYFecha);

/**
 * @swagger
 * /reservas/{reservaId}:
 *   put:
 *     summary: Modificar una reserva existente
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reservaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bloque_tiempo_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Reserva modificada exitosamente
 *       500:
 *         description: Error al modificar reserva
 */
router.put('/:reservaId', authenticateToken, modificarReserva);

/**
 * @swagger
 * /reservas/{reservaId}:
 *   delete:
 *     summary: Eliminar una reserva y liberar el bloque reservado
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reservaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a eliminar
 *     responses:
 *       200:
 *         description: Reserva eliminada y bloque liberado exitosamente
 *       500:
 *         description: Error al eliminar la reserva
 */
router.delete('/:reservaId', authenticateToken, eliminarReserva);

/**
 * @swagger
 * /reservas/{reservaId}:
 *   delete:
 *     summary: Elimina una reserva y libera el bloque asociado
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reservaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a eliminar
 *     responses:
 *       200:
 *         description: Reserva eliminada y bloque liberado exitosamente
 *       500:
 *         description: Error al eliminar y liberar la reserva
 */
router.delete('/:reservaId', authenticateToken, eliminarYLiberarReserva);

/**
 * @swagger
 * /reservas/instalacion/{instalacionId}/disponibilidad:
 *   get:
 *     summary: Obtener disponibilidad de una instalación en un rango de fechas
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: instalacionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la instalación
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango
 *     responses:
 *       200:
 *         description: Resumen de disponibilidad por fecha y bloque de tiempo
 *       500:
 *         description: Error al obtener disponibilidad
 */
router.get('/instalacion/:instalacionId/disponibilidad', authenticateToken,  obtenerDisponibilidadPorRango);

/**
 * @swagger
 * /reservas/usuario/{usuarioId}/fecha/{fecha}:
 *   get:
 *     summary: Contar reservas de un usuario en una fecha específica
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID del usuario
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           description: Fecha para contar reservas (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Número total de reservas del usuario en la fecha
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarioId:
 *                   type: integer
 *                 fecha:
 *                   type: string
 *                   format: date
 *                 totalReservas:
 *                   type: integer
 *       500:
 *         description: Error al contar las reservas
 */
router.get('/usuario/:usuarioId/fecha/:fecha', contarReservasPorFecha);



module.exports = router;
