const express = require('express');
const { obtenerUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario, actualizarPerfil } = require('../controllers/usuariosController');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// Obtener todos los usuarios (solo admin)
router.get('/', authenticateToken, isAdmin, obtenerUsuarios);

// Obtener un usuario por ID (solo admin)
router.get('/:id', authenticateToken, isAdmin, obtenerUsuario);

// Actualizar un usuario (solo admin)
router.put('/:id', authenticateToken, isAdmin, actualizarUsuario);

// Eliminar un usuario (solo admin)
router.delete('/:id', authenticateToken, isAdmin, eliminarUsuario);

// Actualizar perfil (usuario)
router.put('/mi-perfil', authenticateToken, actualizarPerfil);

module.exports = router;
