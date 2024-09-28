// reservasModel.js
const { getConnection } = require('../config/db');

// Crear una nueva reserva
exports.createReserva = async (usuario_id, instalacion_id, fecha_reserva, bloque_tiempo_id, estado_id) => {
  const client = await getConnection();
  try {
    // Verificar la disponibilidad del bloque de tiempo antes de crear la reserva
    const bloqueCheck = await client.query(
      'SELECT disponible FROM bloques_tiempo WHERE id = $1',
      [bloque_tiempo_id]
    );

    if (bloqueCheck.rows.length === 0) {
      throw new Error('El bloque de tiempo especificado no existe.');
    }

    if (!bloqueCheck.rows[0].disponible) {
      throw new Error('El bloque de tiempo no está disponible.');
    }

    // Crear la nueva reserva si el bloque está disponible
    const result = await client.query(
      'INSERT INTO reservas (usuario_id, instalacion_id, fecha_reserva, bloque_tiempo_id, estado_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [usuario_id, instalacion_id, fecha_reserva, bloque_tiempo_id, estado_id]
    );

    // Marcar el bloque como no disponible
    await client.query(
      'UPDATE bloques_tiempo SET disponible = false WHERE id = $1',
      [bloque_tiempo_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Actualizar una reserva existente
exports.updateReserva = async (id, updates) => {
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
    const sql = `UPDATE reservas SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;

    const result = await client.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar la reserva:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Eliminar una reserva
exports.deleteReserva = async (id) => {
  const client = await getConnection();
  try {
    // Obtener la reserva para liberar el bloque de tiempo si existe
    const reserva = await client.query('SELECT bloque_tiempo_id FROM reservas WHERE id = $1', [id]);
    if (reserva.rows.length === 0) {
      throw new Error('Reserva no encontrada.');
    }

    const result = await client.query('DELETE FROM reservas WHERE id = $1 RETURNING *', [id]);

    // Liberar el bloque de tiempo asociado
    await client.query(
      'UPDATE bloques_tiempo SET disponible = true WHERE id = $1',
      [reserva.rows[0].bloque_tiempo_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Obtener todas las reservas con detalles de bloque de tiempo e instalación
exports.getAllReservas = async () => {
    const client = await getConnection();
    try {
      const result = await client.query(`
        SELECT 
          r.id,
          r.usuario_id,
          r.instalacion_id,
          i.nombre AS instalacion_nombre,
          r.fecha_reserva,
          r.bloque_tiempo_id,
          bt.bloque,
          bt.hora_inicio,
          bt.hora_fin,
          r.estado_id,
          e.nombre AS estado_nombre
        FROM 
          reservas r
        JOIN 
          bloques_tiempo bt ON r.bloque_tiempo_id = bt.id
        JOIN 
          instalaciones i ON r.instalacion_id = i.id
        JOIN 
          estados e ON r.estado_id = e.id
        ORDER BY 
          r.fecha_reserva, bt.hora_inicio
      `);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      throw error;
    } finally {
      client.release();
    }
  };
  
  // Obtener una reserva por ID con detalles
  exports.getReservaById = async (id) => {
    const client = await getConnection();
    try {
      const result = await client.query(`
        SELECT 
          r.id,
          r.usuario_id,
          r.instalacion_id,
          i.nombre AS instalacion_nombre,
          r.fecha_reserva,
          r.bloque_tiempo_id,
          bt.bloque,
          bt.hora_inicio,
          bt.hora_fin,
          r.estado_id,
          e.nombre AS estado_nombre
        FROM 
          reservas r
        JOIN 
          bloques_tiempo bt ON r.bloque_tiempo_id = bt.id
        JOIN 
          instalaciones i ON r.instalacion_id = i.id
        JOIN 
          estados e ON r.estado_id = e.id
        WHERE 
          r.id = $1
      `, [id]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener la reserva:', error);
      throw error;
    } finally {
      client.release();
    }
  };