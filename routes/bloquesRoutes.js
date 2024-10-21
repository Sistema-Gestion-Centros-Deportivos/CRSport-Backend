const express = require('express');
const router = express.Router();
const { obtenerBloquesEstandar, generarBloquesSemanales, obtenerDisponibilidad, reservarBloque } = require('../controllers/bloquesController');

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

// Generar bloques semanales para una instalación
/**
 * @swagger
 * /bloques/generar-semanal:
 *   post:
 *     summary: Generar bloques de tiempo semanales para una instalación
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
 *               fechaSemana:
 *                 type: string
 *                 format: date
 *                 description: Fecha del lunes de la semana (yyyy-mm-dd)
 *     responses:
 *       200:
 *         description: Bloques generados exitosamente
 *       500:
 *         description: Error interno al generar bloques
 */
router.post('/generar-semanal', generarBloquesSemanales);

// Obtener disponibilidad de bloques por instalación y semana
/**
 * @swagger
 * /bloques/disponibilidad/{instalacionId}/{fechaSemana}:
 *   get:
 *     summary: Obtener la disponibilidad de bloques para una instalación en una semana específica
 *     tags: [Bloques]
 *     parameters:
 *       - in: path
 *         name: instalacionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la instalación
 *       - in: path
 *         name: fechaSemana
 *         schema:
 *           type: string
 *           format: date
 *           description: Fecha del lunes de la semana (yyyy-mm-dd)
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de bloques disponibles
 *       500:
 *         description: Error al obtener la disponibilidad
 */
router.get('/disponibilidad/:instalacionId/:fechaSemana', obtenerDisponibilidad);

// Reservar un bloque de tiempo
/**
 * @swagger
 * /bloques/reservar:
 *   post:
 *     summary: Reservar un bloque de tiempo para una instalación
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
 *               bloqueTiempoId:
 *                 type: integer
 *               fechaSemana:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Reserva exitosa
 *       400:
 *         description: Bloque no disponible o error de validación
 */
router.post('/reservar', reservarBloque);

module.exports = router;
