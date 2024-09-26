// usuariosController.js
const userModel = require('../models/userModel');

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await userModel.getAllUsers();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID
exports.obtenerUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await userModel.getUserById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;
  try {
    const nuevoUsuario = await userModel.createUser(nombre, correo, contraseña, rol);
    res.status(201).json({ message: 'Usuario creado exitosamente', user: nuevoUsuario });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

// Actualizar un usuario de manera parcial
exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, rol } = req.body;

  // Verificar si el ID está presente
  if (!id) {
    return res.status(400).json({ error: 'El ID del usuario es obligatorio.' });
  }

  try {
    // Llamar al modelo para actualizar solo los campos proporcionados
    const usuarioActualizado = await userModel.updateUser(id, { nombre, correo, rol });
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado exitosamente', user: usuarioActualizado });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};


// Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuarioEliminado = await userModel.deleteUser(id);
    if (!usuarioEliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado exitosamente', user: usuarioEliminado });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

// Función para actualizar el perfil del usuario autenticado
exports.actualizarPerfil = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;
  try {
    // Si la contraseña es proporcionada, cifrarla antes de guardarla
    let hashedPassword;
    if (contraseña) {
      hashedPassword = await bcrypt.hash(contraseña, 10);
    }

    // Lógica para actualizar el perfil del usuario autenticado
    const usuarioActualizado = await userModel.updateUserProfile(req.user.userId, nombre, correo, hashedPassword);
    res.json({ message: 'Perfil actualizado exitosamente', user: usuarioActualizado });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};

// const mysql = require('mysql2/promise');
// const bcrypt = require('bcrypt');
// const dbConfig = require('../config/db');
// const userModel = require('../models/userModel');

// // Obtener todos los usuarios
// exports.obtenerUsuarios = async (req, res) => {
//   const connection = await dbConfig.getConnection();
//   try {
//     const [usuarios] = await connection.execute('SELECT * FROM usuarios');
//     res.json(usuarios);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener usuarios' });
//   } finally {
//     await connection.end();
//   }
// };

// // Obtener un usuario por ID
// exports.obtenerUsuario = async (req, res) => {
//   const connection = await dbConfig.getConnection();
//   const { id } = req.params;
//   try {
//     const [usuarios] = await connection.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
//     res.json(usuarios[0]);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener el usuario' });
//   } finally {
//     await connection.end();
//   }
// };

// // Actualizar usuario (como admin)
// exports.actualizarUsuario = async (req, res) => {
//   const connection = await dbConfig.getConnection();
//   const { id } = req.params;
//   const { nombre, correo, rol } = req.body;
//   try {
//     await connection.execute(
//       'UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id = ?',
//       [nombre, correo, rol, id]
//     );
//     res.json({ message: 'Usuario actualizado exitosamente' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al actualizar el usuario' });
//   } finally {
//     await connection.end();
//   }
// };

// // Eliminar usuario
// exports.eliminarUsuario = async (req, res) => {
//   const connection = await dbConfig.getConnection();
//   const { id } = req.params;
//   try {
//     await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);
//     res.json({ message: 'Usuario eliminado exitosamente' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al eliminar el usuario' });
//   } finally {
//     await connection.end();
//   }
// };

// // Actualizar perfil del usuario (no administrador)
// exports.actualizarPerfil = async (req, res) => {
//   const connection = await dbConfig.getConnection();
//   const { nombre, correo, contraseña } = req.body;
//   const hashedPassword = await bcrypt.hash(contraseña, 10);
//   try {
//     await connection.execute(
//       'UPDATE usuarios SET nombre = ?, correo = ?, contraseña = ? WHERE id = ?',
//       [nombre, correo, hashedPassword, req.user.userId]
//     );
//     res.json({ message: 'Perfil actualizado exitosamente' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al actualizar el perfil' });
//   } finally {
//     await connection.end();
//   }
// };








