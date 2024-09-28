// userModel.js
const { getConnection } = require('../config/db');
const bcrypt = require('bcrypt');

// Crear un nuevo usuario con contraseña cifrada
exports.createUser = async (nombre, correo, contraseña, rol) => {
  const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifrado de contraseña
  const client = await getConnection();
  try {
    const result = await client.query(
      'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, correo, hashedPassword, rol]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Verificar contraseña de usuario
exports.verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword); // Comparación de contraseñas
};

// Buscar usuario por correo
exports.findUserByEmail = async (correo) => {
  const client = await getConnection();
  try {
    const result = await client.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    return result.rows[0];
  } catch (error) {
    console.error('Error al buscar usuario:', error);
    throw error;
  } finally {
    client.release();
  }
};

exports.getAllUsers = async () => {
  const client = await getConnection();
  try {
    const result = await client.query('SELECT * FROM usuarios');
    return result.rows; // Retorna todos los usuarios
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  } finally {
    client.release(); // Libera la conexión
  }
};

// Obtener un usuario por ID
exports.getUserById = async (id) => {
  const client = await getConnection();
  try {
    const result = await client.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0]; // Retorna el usuario encontrado
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw error; // Lanza el error para que lo maneje el controlador
  } finally {
    client.release();
  }
};

// Actualizar un usuario de manera parcial
exports.updateUser = async (id, updates) => {
  const client = await getConnection();

  // Construir la consulta de actualización dinámicamente
  try {
    const fields = [];
    const values = [];
    let index = 1;

    // Agregar campos dinámicamente
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && value !== null) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    // Si no hay campos para actualizar, retornar error
    if (fields.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar.');
    }

    values.push(id); // Añadir el ID al final para la condición WHERE
    const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;

    // Ejecutar la consulta
    const result = await client.query(sql, values);
    return result.rows[0]; // Retorna el usuario actualizado
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error; // Lanza el error para que lo maneje el controlador
  } finally {
    client.release();
  }
};

// Eliminar un usuario
exports.deleteUser = async (id) => {
  const client = await getConnection();
  try {
    const result = await client.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    return result.rows[0]; // Retorna el usuario eliminado
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    throw error; // Lanza el error para que lo maneje el controlador
  } finally {
    client.release();
  }
};

// Actualizar el perfil del usuario autenticado
exports.updateUserProfile = async (userId, nombre, correo, hashedPassword) => {
  const client = await getConnection();
  try {
    // Construir la consulta de actualización dinámicamente solo con los campos proporcionados
    const fields = [];
    const values = [];
    let index = 1;

    if (nombre) {
      fields.push(`nombre = $${index}`);
      values.push(nombre);
      index++;
    }
    if (correo) {
      fields.push(`correo = $${index}`);
      values.push(correo);
      index++;
    }
    if (hashedPassword) {
      fields.push(`contraseña = $${index}`);
      values.push(hashedPassword);
      index++;
    }

    // Si no hay campos para actualizar, retorna un error
    if (fields.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar.');
    }

    values.push(userId); // Añadir el ID del usuario al final para la condición WHERE
    const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;

    // Ejecutar la consulta
    const result = await client.query(sql, values);
    return result.rows[0]; // Retorna el usuario actualizado
  } catch (error) {
    console.error('Error al actualizar el perfil del usuario:', error);
    throw error; // Lanza el error para que lo maneje el controlador
  } finally {
    client.release();
  }
};
