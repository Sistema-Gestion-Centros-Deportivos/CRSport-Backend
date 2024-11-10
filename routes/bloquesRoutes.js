const express = require('express');
const router = express.Router();
const { crearBloqueEstandar, obtenerBloquesEstandar, actualizarBloqueEstandar, eliminarBloqueEstandar, obtenerBloquesPorInstalacion, actualizarDisponibilidadBloque, eliminarBloquesDeInstalacion, consultarDisponibilidad, consultarEstadoBloque, generarBloquesPorRango, bloquearBloque, liberarBloque } = require('../controllers/bloquesController');

// Obtener todos los bloques estándar
/**
 * @swagger
 * /bloques/estandar:
 *   get:
 *     summary: Obtener todos los bloques de tiempo estándar
 *     tags: [Bloques]
 *     responses:
 *       200:
 *         description: Lista de bloques estándar
 *       500:
 *         description: Error al obtener los bloques estándar
 */
router.get('/estandar', obtenerBloquesEstandar);

// Crear un nuevo bloque estándar
/**
 * @swagger
 * /bloques/estandar:
 *   post:
 *     summary: Crear un nuevo bloque de tiempo estándar
 *     tags: [Bloques]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bloque:
 *                 type: integer
 *               horaInicio:
 *                 type: string
 *                 format: time
 *                 example: "08:00:00"
 *               horaFin:
 *                 type: string
 *                 format: time
 *                 example: "08:45:00"
 *     responses:
 *       201:
 *         description: Bloque estándar creado exitosamente
 *       500:
 *         description: Error al crear el bloque estándar
 */
router.post('/estandar', crearBloqueEstandar);

// Actualizar un bloque estándar
/**
 * @swagger
 * /bloques/estandar/{id}:
 *   put:
 *     summary: Actualizar un bloque de tiempo estándar
 *     tags: [Bloques]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del bloque estándar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               horaInicio:
 *                 type: string
 *                 format: time
 *                 example: "09:00:00"
 *               horaFin:
 *                 type: string
 *                 format: time
 *                 example: "09:45:00"
 *     responses:
 *       200:
 *         description: Bloque estándar actualizado exitosamente
 *       500:
 *         description: Error al actualizar el bloque estándar
 */
router.put('/estandar/:id', actualizarBloqueEstandar);

// Eliminar un bloque estándar
/**
 * @swagger
 * /bloques/estandar/{id}:
 *   delete:
 *     summary: Eliminar un bloque de tiempo estándar
 *     tags: [Bloques]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del bloque estándar a eliminar
 *     responses:
 *       204:
 *         description: Bloque estándar eliminado exitosamente
 *       500:
 *         description: Error al eliminar el bloque estándar
 */
router.delete('/estandar/:id', eliminarBloqueEstandar);

// Obtener todos los bloques de tiempo de una instalación específica
/**
 * @swagger
 * /bloques/instalacion/{instalacionId}:
 *   get:
 *     summary: Obtener todos los bloques de tiempo de una instalación
 *     tags: [Bloques]
 *     parameters:
 *       - in: path
 *         name: instalacionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la instalación
 *     responses:
 *       200:
 *         description: Lista de bloques de tiempo de la instalación
 *       500:
 *         description: Error al obtener los bloques de la instalación
 */
router.get('/instalacion/:instalacionId', obtenerBloquesPorInstalacion);

/**
 * @swagger
 * /bloques/generar-rango:
 *   post:
 *     summary: Generar bloques de tiempo en un rango de fechas para una instalación
 *     tags: [Bloques]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instalacionId:
 *                 type: integer
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del rango (yyyy-mm-dd)
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del rango (yyyy-mm-dd)
 *     responses:
 *       200:
 *         description: Bloques generados exitosamente para el rango de fechas
 *       500:
 *         description: Error interno al generar bloques
 */
router.post('/generar-rango', generarBloquesPorRango);

// Actualizar la disponibilidad de un bloque de tiempo en una instalación
/**
 * @swagger
 * /bloques/instalacion/disponibilidad:
 *   put:
 *     summary: Actualizar la disponibilidad de un bloque de tiempo en una instalación
 *     tags: [Bloques]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instalacionId:
 *                 type: integer
 *               bloqueId:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2024-11-20"
 *               disponible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Bloque actualizado exitosamente
 *       500:
 *         description: Error al actualizar el bloque
 */
router.put('/instalacion/disponibilidad', actualizarDisponibilidadBloque);

// Eliminar bloques de tiempo de una instalación en una fecha específica
/**
 * @swagger
 * /bloques/instalacion:
 *   delete:
 *     summary: Eliminar bloques de tiempo de una instalación en una fecha específica
 *     tags: [Bloques]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instalacionId:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2024-11-20"
 *     responses:
 *       204:
 *         description: Bloques eliminados exitosamente
 *       500:
 *         description: Error al eliminar los bloques
 */
router.delete('/instalacion', eliminarBloquesDeInstalacion);

// Obtener disponibilidad de bloques para una fecha específica
/**
 * @swagger
 * /bloques/instalacion/{instalacionId}/disponibilidad/{fecha}:
 *   get:
 *     summary: Consultar disponibilidad de bloques para una instalación en una fecha
 *     tags: 
 *       - Bloques
 *     parameters:
 *       - name: instalacionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la instalación
 *       - name: fecha
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para consultar la disponibilidad (yyyy-mm-dd)
 *     responses:
 *       200:
 *         description: Disponibilidad de bloques en la fecha especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   hora_inicio:
 *                     type: string
 *                     format: time
 *                   hora_fin:
 *                     type: string
 *                     format: time
 *                   disponible:
 *                     type: boolean
 *       500:
 *         description: Error al consultar disponibilidad
 */
router.get('/instalacion/:instalacionId/disponibilidad/:fecha', consultarDisponibilidad);

// Consultar estado de un bloque específico en una instalación y fecha
/**
 * @swagger
 * /bloques/instalacion/{instalacionId}/bloque/{bloqueId}/estado/{fecha}:
 *   get:
 *     summary: Consultar estado de un bloque de tiempo específico
 *     tags: 
 *       - Bloques
 *     parameters:
 *       - name: instalacionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la instalación
 *       - name: bloqueId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del bloque de tiempo
 *       - name: fecha
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para consultar el estado (yyyy-mm-dd)
 *     responses:
 *       200:
 *         description: Estado del bloque
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 hora_inicio:
 *                   type: string
 *                   format: time
 *                 hora_fin:
 *                   type: string
 *                   format: time
 *                 disponible:
 *                   type: boolean
 *       500:
 *         description: Error al consultar el estado del bloque
 */
router.get('/instalacion/:instalacionId/bloque/:bloqueId/estado/:fecha', consultarEstadoBloque);

// Bloquear un bloque de tiempo específico en una instalación sin reserva de usuario
/**
 * @swagger
 * /bloques/instalacion/{instalacionId}/bloquear:
 *   post:
 *     summary: Bloquear un bloque de tiempo específico en una instalación sin reserva de usuario
 *     tags: [Bloques]
 *     parameters:
 *       - name: instalacionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la instalación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bloque_tiempo_id:
 *                 type: integer
 *                 description: ID del bloque de tiempo a bloquear
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha en la que se desea bloquear el bloque de tiempo
 *     responses:
 *       200:
 *         description: Bloque de tiempo bloqueado exitosamente
 *       500:
 *         description: Error al bloquear el bloque de tiempo
 */
router.post('/instalacion/:instalacionId/bloquear', bloquearBloque);

// Liberar un bloque previamente bloqueado en una fecha específica
/**
 * @swagger
 * /bloques/instalacion/{instalacionId}/bloquear/{bloque_tiempo_id}:
 *   delete:
 *     summary: Liberar un bloque previamente bloqueado
 *     tags: [Bloques]
 *     parameters:
 *       - name: instalacionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la instalación
 *       - name: bloque_tiempo_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del bloque de tiempo
 *       - name: fecha
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha en la que se desea liberar el bloque de tiempo
 *     responses:
 *       200:
 *         description: Bloque de tiempo liberado exitosamente
 *       404:
 *         description: Bloque de tiempo no encontrado
 *       500:
 *         description: Error al liberar el bloque de tiempo
 */
router.delete('/instalacion/:instalacionId/bloquear/:bloque_tiempo_id', liberarBloque);

module.exports = router;
