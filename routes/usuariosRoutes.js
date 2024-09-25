// usuariosRoutes.js
const express = require('express');
const router = express.Router();
const { 
    obtenerUsuarios, 
    obtenerUsuario, 
    actualizarUsuario, 
    eliminarUsuario, 
    actualizarPerfil 
} = require('../controllers/usuariosController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *           example: Juan Pérez
 *         correo:
 *           type: string
 *           description: Correo electrónico del usuario
 *           example: juan.perez@example.com
 *         rol:
 *           type: string
 *           description: Rol del usuario (usuario o administrador)
 *           example: usuario
 *         creado_en:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del usuario
 *           example: 2024-09-25T06:30:08.177Z
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       500:
 *         description: Error al obtener los usuarios
 */
// Obtener todos los usuarios (solo admin)
router.get('/', authenticateToken, isAdmin, obtenerUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a obtener
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener el usuario
 */
// Obtener un usuario por ID (solo admin)
router.get('/:id', authenticateToken, isAdmin, obtenerUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un usuario
 *     description: Actualiza los campos especificados de un usuario. Solo los campos enviados serán actualizados.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del usuario
 *                 example: Juan Pérez
 *               correo:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: juan.perez@example.com
 *               rol:
 *                 type: string
 *                 description: Rol del usuario (usuario, administrador)
 *                 example: usuario
 *           description: Los campos a actualizar. Solo los campos especificados serán modificados.
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario actualizado exitosamente
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
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
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar el usuario
 */
// Actualizar un usuario parcialmente (solo admin)
router.patch('/:id', authenticateToken, isAdmin, actualizarUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar el usuario
 */
// Eliminar un usuario (solo admin)
router.delete('/:id', authenticateToken, isAdmin, eliminarUsuario);

/**
 * @swagger
 * /usuarios/mi-perfil:
 *   put:
 *     summary: Actualizar perfil del usuario autenticado
 *     tags: [Usuarios]
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
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al actualizar el perfil
 */
// Actualizar perfil (usuario)
router.put('/mi-perfil', authenticateToken, actualizarPerfil);

module.exports = router;
