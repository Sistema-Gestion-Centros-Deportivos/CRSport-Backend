const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para la autenticación de usuarios
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               rol:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       500:
 *         description: Error al registrar usuario
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Usuario no encontrado o contraseña incorrecta
 *       500:
 *         description: Error al iniciar sesión
 */
router.post('/login', login);

module.exports = router;