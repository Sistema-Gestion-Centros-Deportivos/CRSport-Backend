const express = require('express');
const router = express.Router();
const { obtenerActividades } = require('../controllers/actividadesController');


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

module.exports = router;
