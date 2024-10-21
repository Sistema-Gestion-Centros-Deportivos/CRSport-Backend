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

// asignar actividad a instalacion
exports.asignarActividadAInstalacion = async (instalacionId, actividadId) => {
  const client = await getConnection();
  try {
    const result = await client.query(
      'INSERT INTO instalaciones_actividades (instalacion_id, actividad_id) VALUES ($1, $2) RETURNING *',
      [instalacionId, actividadId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al asignar actividad a instalación:', error);
    throw error;
  } finally {
    client.release();
  }
};