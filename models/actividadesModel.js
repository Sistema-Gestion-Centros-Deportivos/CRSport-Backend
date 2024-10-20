const { getConnection } = require('../config/db');

// Obtener todas las actividades
exports.getAllActividades = async () => {
  const client = await getConnection();
  try {
    const result = await client.query('SELECT * FROM actividades');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    throw error;
  } finally {
    client.release();
  }
};

