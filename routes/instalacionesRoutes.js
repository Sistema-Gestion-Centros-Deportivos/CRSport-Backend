const express = require('express');
const router = express.Router();
const {
  crearInstalacion,
  obtenerInstalaciones,
  obtenerInstalacion,
  actualizarInstalacion,
  eliminarInstalacion,
  subirImagenFirebase,
  upload,
  obtenerInstalacionesPorActividad
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
 *         imagen_url:
 *           type: string
 *           description: URL de la imagen de la instalación
 *           example: https://example.com/uploads/sala-conferencias.jpg
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
 * /instalaciones/subir-imagen:
 *   post:
 *     summary: Subir una imagen de instalación a Firebase Storage
 *     tags: [Instalaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: El archivo de imagen que se desea subir.
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagen subida exitosamente
 *                 imageUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket-name/imagen.jpg
 *       400:
 *         description: No se proporcionó ningún archivo o hubo un error en la subida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No se subió ningún archivo.
 *       500:
 *         description: Error interno al subir la imagen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al subir la imagen a Firebase Storage.
 */
router.post('/subir-imagen', upload.single('imagen'), subirImagenFirebase);

/**
 * @swagger
 * /instalaciones:
 *   post:
 *     summary: Crear una nueva instalación con la URL de imagen
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
 *                 example: Sala de conferencias
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la instalación
 *                 example: "Una sala para reuniones de negocios"
 *               ubicacion:
 *                 type: string
 *                 description: Ubicación de la instalación
 *                 example: "Edificio A"
 *               disponible_desde:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora desde la cual la instalación está disponible
 *                 example: "2024-09-25T08:00:00Z"
 *               disponible_hasta:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora hasta la cual la instalación está disponible
 *                 example: "2024-09-25T18:00:00Z"
 *               imagen_url:
 *                 type: string
 *                 description: URL de la imagen de la instalación subida a Firebase
 *                 example: "https://url-de-imagen-en-firebase"
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
 * /instalaciones/{id}:
 *   patch:
 *     summary: Actualizar una instalación con la URL de la imagen
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
 *               imagen_url:
 *                 type: string
 *                 description: URL de la imagen de la instalación subida a Firebase
 *                 example: "https://url-de-imagen-en-firebase"
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

/**
 * @swagger
 * /instalaciones/actividad/{actividadId}:
 *   get:
 *     summary: Obtener todas las instalaciones asociadas a una actividad
 *     tags: [Instalaciones]
 *     parameters:
 *       - in: path
 *         name: actividadId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la actividad
 *     responses:
 *       200:
 *         description: Lista de instalaciones obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instalacion'
 *       404:
 *         description: No se encontraron instalaciones para esta actividad
 *       500:
 *         description: Error al obtener instalaciones por actividad
 */
// Obtener instalaciones por actividad
router.get('/actividad/:actividadId', obtenerInstalacionesPorActividad);

module.exports = router;


module.exports = router;
