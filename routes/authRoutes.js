const express = require('express');
const { register, login, solicitarRecuperacionContraseña, restablecerContraseña } = require('../controllers/authController');
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


/**
 * @swagger
 * /auth/recuperar-contra:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Autenticación]
 *     description: Envía un correo electrónico con un enlace para restablecer la contraseña del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 description: Correo electrónico del usuario que olvidó su contraseña.
 *                 example: usuario@correo.com
 *     responses:
 *       200:
 *         description: Correo de recuperación enviado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Correo de recuperación enviado exitosamente.
 *       404:
 *         description: El correo proporcionado no está registrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usuario no encontrado.
 *       500:
 *         description: Error al enviar el correo de recuperación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al enviar el correo de recuperación.
 */
router.post('/recuperar-contra', (req, res, next) => {
    const { correo } = req.body;
    if (!correo || !correo.includes('@')) {
      return res.status(400).json({ error: 'Correo electrónico inválido' });
    }
    next();
}, solicitarRecuperacionContraseña);

/**
 * @swagger
 * /auth/restablecer-contra:
 *   post:
 *     summary: Restablecer la contraseña del usuario
 *     tags: [Autenticación]
 *     description: Permite al usuario restablecer su contraseña usando un token enviado por correo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de recuperación enviado por correo.
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               nuevaContraseña:
 *                 type: string
 *                 description: La nueva contraseña que el usuario desea establecer.
 *                 example: nuevaPassword123
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña restablecida exitosamente.
 *       400:
 *         description: El token de recuperación ha expirado o es inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El token de recuperación ha expirado.
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Usuario no encontrado.
 *       500:
 *         description: Error al restablecer la contraseña.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al restablecer la contraseña.
 */
router.post('/restablecer-contra', (req, res, next) => {
    const { token, nuevaContraseña } = req.body;
    if (!token || !nuevaContraseña || nuevaContraseña.length < 6) {
      return res.status(400).json({ error: 'Token inválido o contraseña demasiado corta' });
    }
    next();
}, restablecerContraseña);


module.exports = router;