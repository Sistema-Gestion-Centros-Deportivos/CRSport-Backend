const express = require('express');
const router = express.Router();
const { 
    crearInstalacion, 
    obtenerInstalaciones, 
    obtenerInstalacion, 
    actualizarInstalacion, 
    eliminarInstalacion 
} = require('../controllers/instalacionesController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Instalaciones
 *   description: Endpoints para gestionar instalaciones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Instalacion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la instalación
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre de la instalación
 *           example: Sala de conferencias
 *         descripcion:
 *           type: string
 *           description: Descripción de la instalación
 *           example: Una amplia sala con capacidad para 100 personas.
 *         ubicacion:
 *           type: string
 *           description: Ubicación de la instalación
 *           example: Edificio A, piso 3
 *         disponible_desde:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora desde la cual la instalación está disponible
 *           example: 2024-09-25T08:00:00Z
 *         disponible_hasta:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora hasta la cual la instalación está disponible
 *           example: 2024-09-25T18:00:00Z
 */

/**
 * @swagger
 * /instalaciones:
 *   get:
 *     summary: Obtener todas las instalaciones
 *     tags: [Instalaciones]
 *     responses:
 *       200:
 *         description: Lista de instalaciones obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instalacion'
 *       500:
 *         description: Error al obtener las instalaciones
 */
// Obtener todas las instalaciones
router.get('/', obtenerInstalaciones);


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
 *           type: integer
 *         required: true
 *         description: ID de la instalación a obtener
 *     responses:
 *       200:
 *         description: Instalación obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instalacion'
 *       404:
 *         description: Instalación no encontrada
 *       500:
 *         description: Error al obtener la instalación
 */
// Obtener una instalación por ID
router.get('/:id', authenticateToken, obtenerInstalacion);

/**
 * @swagger
 * /instalaciones:
 *   post:
 *     summary: Crear una nueva instalación
 *     tags: [Instalaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la instalación
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la instalación
 *               ubicacion:
 *                 type: string
 *                 description: Ubicación de la instalación
 *               disponible_desde:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora desde la cual la instalación está disponible
 *               disponible_hasta:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora hasta la cual la instalación está disponible
 *     responses:
 *       201:
 *         description: Instalación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instalacion'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear la instalación
 */
// Crear una nueva instalación
router.post('/', authenticateToken, isAdmin, crearInstalacion);

/**
 * @swagger
 * /instalaciones/{id}:
 *   patch:
 *     summary: Actualizar una instalación
 *     tags: [Instalaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la instalación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la instalación
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la instalación
 *               ubicacion:
 *                 type: string
 *                 description: Ubicación de la instalación
 *               disponible_desde:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora desde la cual la instalación está disponible
 *               disponible_hasta:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora hasta la cual la instalación está disponible
 *     responses:
 *       200:
 *         description: Instalación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instalacion'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Instalación no encontrada
 *       500:
 *         description: Error al actualizar la instalación
 */
// Actualizar una instalación
router.patch('/:id', authenticateToken, isAdmin, actualizarInstalacion);

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
 *           type: integer
 *         required: true
 *         description: ID de la instalación a eliminar
 *     responses:
 *       200:
 *         description: Instalación eliminada correctamente
 *       404:
 *         description: Instalación no encontrada
 *       500:
 *         description: Error al eliminar la instalación
 */
// Eliminar una instalación
router.delete('/:id', authenticateToken, isAdmin, eliminarInstalacion);

module.exports = router;
