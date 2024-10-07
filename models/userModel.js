// userModel.js
const { getConnection } = require('../config/db');
const bcrypt = require('bcrypt');

// Crear un nuevo usuario con contraseña cifrada
exports.createUser = async (nombre, correo, contraseña, rol = 'usuario') => {
  const hashedPassword = await bcrypt.hash(contraseña, 10); // Cifrado de contraseña
  const client = await getConnection();
  try {
    const result = await client.query(
      'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, correo, hashedPassword, rol || 'usuario'] // Si rol es null o undefined, se asigna "usuario"
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

// Obtener todos los usuarios
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

// Actualizar contraseña del usuario
exports.updatePassword = async (userId, nuevaContraseña) => {
  const client = await getConnection();
  try {
    // Cifrar la nueva contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
    
    const result = await client.query(
      'UPDATE usuarios SET contraseña = $1 WHERE id = $2 RETURNING *',
      [hashedPassword, userId]
    );

    return result.rows[0]; // Retorna el usuario con la contraseña actualizada
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Actualizar el perfil del usuario autenticado sin modificar la contraseña
exports.updateUserProfile = async (userId, nombre, correo) => {
  const client = await getConnection();
  try {
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

    if (fields.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar.');
    }

    values.push(userId); // Añadir el ID del usuario al final para la condición WHERE
    const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;

    const result = await client.query(sql, values);
    return result.rows[0]; // Retorna el usuario actualizado
  } catch (error) {
    console.error('Error al actualizar el perfil del usuario:', error);
    throw error;
  } finally {
    client.release();
  }
};
