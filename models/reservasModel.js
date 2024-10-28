// reservasModel.js
const { getConnection } = require('../config/db');

// Verificar si una reserva ya existe en un bloque de tiempo semanal específico
exports.getReservaByBloqueSemanal = async (instalacion_bloque_semanal_id, fecha_reserva) => {
  const client = await getConnection();
  try {
    const result = await client.query(
      'SELECT * FROM reservas WHERE instalacion_bloque_semanal_id = $1 AND fecha_reserva = $2',
      [instalacion_bloque_semanal_id, fecha_reserva]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al verificar reserva existente:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Crear una nueva reserva
exports.createReserva = async (usuario_id, instalacion_bloque_semanal_id, fecha_reserva, estado_id) => {
  const client = await getConnection();
  try {
    const query = `
      INSERT INTO reservas (usuario_id, instalacion_bloque_semanal_id, fecha_reserva, estado_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [usuario_id, instalacion_bloque_semanal_id, fecha_reserva, estado_id];
    const result = await client.query(query, values);

    // Ahora aseguramos que la disponibilidad se actualice solo para el bloque correcto
    const actualizarDisponibilidadQuery = `
      UPDATE instalaciones_bloques_semanales
      SET disponible = false
      WHERE id = $1
      AND instalacion_id = (
        SELECT instalacion_id
        FROM instalaciones_bloques_semanales
        WHERE id = $1
      )
      AND bloque_tiempo_id = (
        SELECT bloque_tiempo_id
        FROM instalaciones_bloques_semanales
        WHERE id = $1
      )
      AND fecha_semana = $2
    `;
    await client.query(actualizarDisponibilidadQuery, [instalacion_bloque_semanal_id, fecha_reserva]);

    return result.rows[0]; // Devolver la reserva creada
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

// Eliminar una reserva por ID
exports.eliminarReserva = async (id) => {
  const client = await getConnection();
  try {
    // Obtener el bloque de tiempo asociado a la reserva
    const queryObtenerReserva = 'SELECT instalacion_bloque_semanal_id FROM reservas WHERE id = $1';
    const resultReserva = await client.query(queryObtenerReserva, [id]);

    if (resultReserva.rowCount === 0) {
      return null;  // Reserva no encontrada
    }

    const instalacion_bloque_semanal_id = resultReserva.rows[0].instalacion_bloque_semanal_id;

    // Eliminar la reserva
    const queryEliminarReserva = 'DELETE FROM reservas WHERE id = $1 RETURNING *';
    const resultEliminar = await client.query(queryEliminarReserva, [id]);

    // Actualizar la disponibilidad del bloque
    const queryActualizarDisponibilidad = `
      UPDATE instalaciones_bloques_semanales
      SET disponible = true
      WHERE id = $1
    `;
    await client.query(queryActualizarDisponibilidad, [instalacion_bloque_semanal_id]);

    return resultEliminar.rows[0];
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    throw error;
  } finally {
    client.release();
  }
};



// Obtener todas las reservas con la información de los bloques de tiempo y la instalación
exports.getAllReservas = async () => {
  const client = await getConnection();
  try {
    const result = await client.query(`
      SELECT r.id, r.fecha_reserva, r.usuario_id, r.estado_id, 
             ibs.fecha_semana, ibs.disponible,
             bt.bloque, bt.hora_inicio, bt.hora_fin,
             i.nombre AS instalacion_nombre
      FROM reservas r
      JOIN instalaciones_bloques_semanales ibs ON r.instalacion_bloque_semanal_id = ibs.id
      JOIN bloques_tiempo_estandar bt ON ibs.bloque_tiempo_id = bt.id
      JOIN instalaciones i ON ibs.instalacion_id = i.id
    `);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
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