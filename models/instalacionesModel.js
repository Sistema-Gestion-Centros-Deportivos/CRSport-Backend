const { getConnection } = require('../config/db');

// exports.getAll = async () => {
//   const connection = await mysql.getConnection();
//   const [rows] = await connection.execute('SELECT * FROM instalaciones');
//   return rows;
// };

// exports.create = async (nombre, descripcion, ubicacion, disponible_desde, disponible_hasta) => {
//   const connection = await mysql.getConnection();
//   const [result] = await connection.execute(
//     'INSERT INTO instalaciones (nombre, descripcion, ubicacion, disponible_desde, disponible_hasta) VALUES (?, ?, ?, ?, ?)',
//     [nombre, descripcion, ubicacion, disponible_desde, disponible_hasta]
//   );
//   return result;
// };

// Obtener todas las instalaciones
exports.getAllInstalaciones = async () => {
  const client = await getConnection();
  try {
    const result = await client.query('SELECT * FROM instalaciones');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener las instalaciones:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Obtener una instalación por su ID
exports.getInstalacionById = async (id) => {
  const client = await getConnection();
  try {
    const result = await client.query('SELECT * FROM instalaciones WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener la instalación:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Crear una nueva instalación
exports.createInstalacion = async (nombre, descripcion, ubicacion, disponible_desde, disponible_hasta) => {
  const client = await getConnection();
  try {
    const result = await client.query(
      'INSERT INTO instalaciones (nombre, descripcion, ubicacion, disponible_desde, disponible_hasta) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, descripcion, ubicacion, disponible_desde, disponible_hasta]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al crear la instalación:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Actualizar una instalación
exports.updateInstalacion = async (id, updates) => {
  const client = await getConnection();
  try {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && value !== null) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar.');
    }

    values.push(id);
    const sql = `UPDATE instalaciones SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    const result = await client.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar la instalación:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Eliminar una instalación
exports.deleteInstalacion = async (id) => {
  const client = await getConnection();
  try {
    const result = await client.query('DELETE FROM instalaciones WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error al eliminar la instalación:', error);
    throw error;
  } finally {
    client.release();
  }
};

