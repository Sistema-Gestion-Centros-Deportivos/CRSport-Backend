const express = require('express');
const { obtenerUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario, actualizarPerfil } = require('../controllers/usuariosController');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');


/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestionar usuarios
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
 *   put:
 *     summary: Actualizar un usuario
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
 *               email:
 *                 type: string
 *               rol:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar el usuario
 */
// Actualizar un usuario (solo admin)
router.put('/:id', authenticateToken, isAdmin, actualizarUsuario);


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
 *               email:
 *                 type: string
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
