const express = require('express');
const router = express.Router();
const { obtenerActividades, asignarActividadAInstalacion } = require('../controllers/actividadesController');


/**
 * @swagger
 * /actividades:
 *   get:
 *     summary: Obtener todas las actividades
 *     tags: [Actividades]
 *     responses:
 *       200:
 *         description: Lista de actividades obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Actividad'
 *       500:
 *         description: Error al obtener actividades
 */
// Obtener todas las actividades
router.get('/', obtenerActividades);

// asignar actividad a instalacion
router.post('/asignar', asignarActividadAInstalacion);
// swagger de asignar actividad a instalacion
/**
 * @swagger
 * /actividades/asignar:
 *   post:
 *     summary: Asignar una actividad a una instalación
 *     tags: [Actividades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instalacion_id:
 *                 type: integer
 *               actividad_id:
 *                 type: integer
 *             example:
 *               instalacion_id: 1
 *               actividad_id: 1
 *     responses:
 *       201:
 *         description: Actividad asignada a instalación correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstalacionActividad'
 *       500:
 *         description: Error al asignar actividad a instalación
 */

module.exports = router;
