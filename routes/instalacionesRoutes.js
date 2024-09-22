const express = require('express');
const { crearInstalacion, obtenerInstalaciones, obtenerInstalacion, actualizarInstalacion, eliminarInstalacion } = require('../controllers/instalacionesController');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Instalaciones
 *   description: Endpoints para gestionar instalaciones
 */

/**
 * @swagger
 * /instalaciones:
 *   post:
 *     summary: Crear una nueva instalación
 *     tags: [Instalaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               disponible_desde:
 *                 type: string
 *                 format: date-time
 *               disponible_hasta:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Instalación creada correctamente
 *       500:
 *         description: Error al crear la instalación
 */


router.post('/', authenticateToken, isAdmin, crearInstalacion);

/**
 * @swagger
 * /instalaciones:
 *   get:
 *     summary: Obtener todas las instalaciones
 *     tags: [Instalaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de instalaciones
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al obtener las instalaciones
 */
// Obtener todas las instalaciones
router.get('/', authenticateToken, obtenerInstalaciones);

/**
 * @swagger
 * /instalaciones/{id}:
 *   get:
 *     summary: Obtener una instalación por ID
 *     tags: [Instalaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la instalación a obtener
 *     responses:
 *       200:
 *         description: Instalación obtenida correctamente
 *       404:
 *         description: Instalación no encontrada
 *       500:
 *         description: Error al obtener la instalación
 */
router.get('/:id', authenticateToken, obtenerInstalacion);

/**
 * @swagger
 * /instalaciones/{id}:
 *   put:
 *     summary: Actualizar una instalación
 *     tags: [Instalaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la instalación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
*                 type: string
 *               descripcion:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               disponible_desde:
 *                 type: string
 *                 format: date-time
 *               disponible_hasta:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Instalación actualizada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Instalación no encontrada
 *       500:
 *         description: Error al actualizar la instalación
 */
// Actualizar instalación (solo admin)
router.put('/:id', authenticateToken, isAdmin, actualizarInstalacion);

/**
 * @swagger
 * /instalaciones/{id}:
 *   delete:
 *     summary: Eliminar una instalación
 *     tags: [Instalaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la instalación
 *     responses:
 *       200:
 *         description: Instalación eliminada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Instalación no encontrada
 *       500:
 *         description: Error al eliminar la instalación
 */
// Eliminar instalación (solo admin)
router.delete('/:id', authenticateToken, isAdmin, eliminarInstalacion);

module.exports = router;
