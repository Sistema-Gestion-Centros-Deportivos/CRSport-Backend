// bloquesTiempoRoutes.js
const express = require('express');
const router = express.Router();
const { crearBloqueTiempo, obtenerBloquesPorInstalacion, actualizarBloqueTiempo, eliminarBloqueTiempo, obtenerBloquesTiempo} = require('../controllers/bloquesTiempoController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Bloques de Tiempo
 *   description: Endpoints para gestionar bloques de tiempo de las instalaciones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BloqueTiempo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del bloque de tiempo
 *           example: 1
 *         instalacion_id:
 *           type: integer
 *           description: ID de la instalación a la que pertenece el bloque
 *           example: 2
 *         bloque:
 *           type: integer
 *           description: Número del bloque de tiempo
 *           example: 1
 *         hora_inicio:
 *           type: string
 *           format: time
 *           description: Hora de inicio del bloque de tiempo
 *           example: "09:00:00"
 *         hora_fin:
 *           type: string
 *           format: time
 *           description: Hora de fin del bloque de tiempo
 *           example: "10:00:00"
 *         disponible:
 *           type: boolean
 *           description: Indica si el bloque de tiempo está disponible para reservas
 *           example: true
 */

/**
 * @swagger
 * /bloques-tiempo:
 *   post:
 *     summary: Crear un nuevo bloque de tiempo
 *     tags: [Bloques de Tiempo]
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
 *                 description: ID de la instalación
 *               bloque:
 *                 type: integer
 *                 description: Número del bloque
 *               hora_inicio:
 *                 type: string
 *                 format: time
 *                 description: Hora de inicio del bloque
 *               hora_fin:
 *                 type: string
 *                 format: time
 *                 description: Hora de fin del bloque
 *               disponible:
 *                 type: boolean
 *                 description: Disponibilidad del bloque
 *                 default: true
 *     responses:
 *       201:
 *         description: Bloque de tiempo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bloque de tiempo creado exitosamente
 *                 bloque:
 *                   $ref: '#/components/schemas/BloqueTiempo'
 *       400:
 *         description: Error de validación o bloque no disponible
 *       500:
 *         description: Error al crear el bloque de tiempo
 */
router.post('/', authenticateToken, isAdmin, crearBloqueTiempo);

// Obtener todos los bloques de tiempo
router.get('/', authenticateToken, isAdmin, obtenerBloquesTiempo);
//swagger obtener todos los bloques de tiempo
/**
 * @swagger
 * /bloques-tiempo:
 *   get:
 *     summary: Obtener todos los bloques de tiempo
 *     tags: [Bloques de Tiempo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de bloques de tiempo obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BloqueTiempo'
 *       500:
 *         description: Error al obtener los bloques de tiempo
 */



/**
 * @swagger
 * /bloques-tiempo/{instalacion_id}:
 *   get:
 *     summary: Obtener todos los bloques de tiempo por instalación
 *     tags: [Bloques de Tiempo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: instalacion_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la instalación para obtener sus bloques de tiempo
 *     responses:
 *       200:
 *         description: Lista de bloques de tiempo obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BloqueTiempo'
 *       500:
 *         description: Error al obtener los bloques de tiempo
 */
router.get('/:instalacion_id', authenticateToken, obtenerBloquesPorInstalacion);

/**
 * @swagger
 * /bloques-tiempo/{id}:
 *   patch:
 *     summary: Actualizar un bloque de tiempo
 *     tags: [Bloques de Tiempo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del bloque de tiempo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bloque:
 *                 type: integer
 *                 description: Número del bloque de tiempo
 *                 example: 2
 *               hora_inicio:
 *                 type: string
 *                 format: time
 *                 description: Hora de inicio del bloque de tiempo
 *                 example: "09:00:00"
 *               hora_fin:
 *                 type: string
 *                 format: time
 *                 description: Hora de fin del bloque de tiempo
 *                 example: "09:45:00"
 *               disponible:
 *                 type: boolean
 *                 description: Disponibilidad del bloque de tiempo
 *                 example: true
 *           description: Campos opcionales para actualizar. Solo los campos especificados serán modificados.
 *     responses:
 *       200:
 *         description: Bloque de tiempo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bloque de tiempo actualizado exitosamente
 *                 bloque:
 *                   $ref: '#/components/schemas/BloqueTiempo'
 *       400:
 *         description: Error de validación o campos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No se proporcionaron campos para actualizar.
 *       404:
 *         description: Bloque de tiempo no encontrado
 *       500:
 *         description: Error al actualizar el bloque de tiempo
 */
router.patch('/:id', authenticateToken, isAdmin, actualizarBloqueTiempo);

/**
 * @swagger
 * /bloques-tiempo/{id}:
 *   delete:
 *     summary: Eliminar un bloque de tiempo
 *     tags: [Bloques de Tiempo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del bloque de tiempo a eliminar
 *     responses:
 *       200:
 *         description: Bloque de tiempo eliminado exitosamente
 *       404:
 *         description: Bloque de tiempo no encontrado
 *       500:
 *         description: Error al eliminar el bloque de tiempo
 */
router.delete('/:id', authenticateToken, isAdmin, eliminarBloqueTiempo);


module.exports = router;
