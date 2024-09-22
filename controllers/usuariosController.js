const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dbConfig = require('../config/db');
const userModel = require('../models/userModel');

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  const connection = await dbConfig.getConnection();
  try {
    const [usuarios] = await connection.execute('SELECT * FROM usuarios');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  } finally {
    await connection.end();
  }
};

// Obtener un usuario por ID
exports.obtenerUsuario = async (req, res) => {
  const connection = await dbConfig.getConnection();
  const { id } = req.params;
  try {
    const [usuarios] = await connection.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
    res.json(usuarios[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  } finally {
    await connection.end();
  }
};

// Actualizar usuario (como admin)
exports.actualizarUsuario = async (req, res) => {
  const connection = await dbConfig.getConnection();
  const { id } = req.params;
  const { nombre, correo, rol } = req.body;
  try {
    await connection.execute(
      'UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id = ?',
      [nombre, correo, rol, id]
    );
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  } finally {
    await connection.end();
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  const connection = await dbConfig.getConnection();
  const { id } = req.params;
  try {
    await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  } finally {
    await connection.end();
  }
};

// Actualizar perfil del usuario (no administrador)
exports.actualizarPerfil = async (req, res) => {
  const connection = await dbConfig.getConnection();
  const { nombre, correo, contraseña } = req.body;
  const hashedPassword = await bcrypt.hash(contraseña, 10);
  try {
    await connection.execute(
      'UPDATE usuarios SET nombre = ?, correo = ?, contraseña = ? WHERE id = ?',
      [nombre, correo, hashedPassword, req.user.userId]
    );
    res.json({ message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  } finally {
    await connection.end();
  }
};








