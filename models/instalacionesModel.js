const { getConnection } = require('../config/db');

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
exports.createInstalacion = async (nombre, descripcion, ubicacion, disponible_desde, disponible_hasta, imagen) => {
  const client = await getConnection();
  try {
    const result = await client.query(
      'INSERT INTO instalaciones (nombre, descripcion, ubicacion, disponible_desde, disponible_hasta, imagen) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, descripcion, ubicacion, disponible_desde, disponible_hasta, imagen]
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
  const fields = [];
  const values = [];

  // Filtrar solo los campos que no sean undefined o nulos
  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined && updates[key] !== null) {
      fields.push(`${key} = $${fields.length + 1}`);
      values.push(updates[key]);
    }
  });

  // Si no hay campos para actualizar, lanzar un error
  if (fields.length === 0) {
    throw new Error('No se proporcionaron campos para actualizar.');
  }

  values.push(id); // El id será el último valor en el array

  const query = `UPDATE instalaciones SET ${fields.join(', ')} WHERE id = $${fields.length + 1}`;

  const client = await getConnection();
  try {
    const result = await client.query(query, values);
    await client.release(); // Cerrar la conexión

    if (result.rowCount === 0) {
      throw new Error('Instalación no encontrada');
    }

    return result;
  } catch (error) {
    console.error('Error al actualizar instalación:', error);
    throw error;
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

