// reservasModel.js
const { getConnection } = require('../config/db');

// Crear una nueva reserva
exports.crearReserva = async (usuarioId, instalacionBloquePeriodicoId, estadoId = 2) => {
  const client = await getConnection();
  try {
    // Iniciar una transacción
    await client.query('BEGIN');

    // Verificar si el bloque está disponible
    const verificarDisponibilidadQuery = `
      SELECT disponible
      FROM instalaciones_bloques_periodicos
      WHERE id = $1
    `;
    const { rows: disponibilidadRows } = await client.query(verificarDisponibilidadQuery, [instalacionBloquePeriodicoId]);

    if (!disponibilidadRows[0] || !disponibilidadRows[0].disponible) {
      throw new Error('El bloque no está disponible.');
    }

    // Insertar la reserva
    const insertReservaQuery = `
      INSERT INTO reservas (usuario_id, estado_id, instalacion_bloque_periodico_id)
      VALUES ($1, $2, $3) RETURNING id
    `;
    const { rows } = await client.query(insertReservaQuery, [usuarioId, estadoId, instalacionBloquePeriodicoId]);
    const reservaId = rows[0].id;

    // Actualizar la disponibilidad del bloque
    const updateDisponibilidadQuery = `
      UPDATE instalaciones_bloques_periodicos
      SET disponible = FALSE
      WHERE id = $1
    `;
    await client.query(updateDisponibilidadQuery, [instalacionBloquePeriodicoId]);

    // Confirmar la transacción
    await client.query('COMMIT');
    return reservaId;
  } catch (error) {
    // Revertir la transacción en caso de error
    await client.query('ROLLBACK');
    console.error('Error al crear la reserva:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Obtener todas las reservas
exports.getAllReservas = async () => {
  const client = await getConnection();
  try {
      const query = `
          SELECT 
              r.id AS reserva_id,
              r.usuario_id,
              u.nombre AS usuario_nombre,
              r.estado_id,
              e.nombre AS estado_nombre,
              r.instalacion_bloque_periodico_id,
              ibp.instalacion_id,
              i.nombre AS instalacion_nombre,
              ibp.bloque_tiempo_id,
              ibp.fecha,  -- Añadimos el campo de fecha
              b.hora_inicio,
              b.hora_fin,
              r.creado_en
          FROM 
              reservas r
          JOIN 
              usuarios u ON r.usuario_id = u.id
          JOIN 
              estados e ON r.estado_id = e.id
          JOIN 
              instalaciones_bloques_periodicos ibp ON r.instalacion_bloque_periodico_id = ibp.id
          JOIN 
              instalaciones i ON ibp.instalacion_id = i.id
          JOIN 
              bloques_tiempo_estandar b ON ibp.bloque_tiempo_id = b.id
          ORDER BY 
              r.creado_en DESC
      `;
      const result = await client.query(query);
      return result.rows;
  } catch (error) {
      console.error('Error al obtener todas las reservas:', error);
      throw error;
  } finally {
      client.release();
  }
};

// Obtener reservas por usuario
exports.getReservasByUsuarioId = async (usuarioId) => {
  const client = await getConnection();
  try {
      const query = `
          SELECT 
              r.id AS reserva_id,
              r.usuario_id,
              u.nombre AS usuario_nombre,
              r.estado_id,
              e.nombre AS estado_nombre,
              r.instalacion_bloque_periodico_id,
              ibp.instalacion_id,
              i.nombre AS instalacion_nombre,
              ibp.bloque_tiempo_id,
              ibp.fecha,
              b.hora_inicio,
              b.hora_fin,
              r.creado_en
          FROM 
              reservas r
          JOIN 
              usuarios u ON r.usuario_id = u.id
          JOIN 
              estados e ON r.estado_id = e.id
          JOIN 
              instalaciones_bloques_periodicos ibp ON r.instalacion_bloque_periodico_id = ibp.id
          JOIN 
              instalaciones i ON ibp.instalacion_id = i.id
          JOIN 
              bloques_tiempo_estandar b ON ibp.bloque_tiempo_id = b.id
          WHERE 
              r.usuario_id = $1
          ORDER BY 
              r.creado_en DESC
      `;
      const result = await client.query(query, [usuarioId]);
      return result.rows;
  } catch (error) {
      console.error('Error al obtener las reservas por usuario:', error);
      throw error;
  } finally {
      client.release();
  }
};

// Obtener reservas por instalación y fecha
exports.getReservasPorInstalacionYFecha = async (instalacionId, fecha) => {
  const client = await getConnection();
  try {
      const query = `
          SELECT r.*, ibp.fecha AS fecha_reserva
          FROM reservas r
          JOIN instalaciones_bloques_periodicos ibp ON r.instalacion_bloque_periodico_id = ibp.id
          WHERE ibp.instalacion_id = $1 AND DATE(ibp.fecha) = $2
      `;
      const result = await client.query(query, [instalacionId, fecha]);
      return result.rows;
  } catch (error) {
      console.error('Error al obtener reservas:', error);
      throw error;
  } finally {
      client.release();
  }
};

// Modificar una reserva existente
exports.modificarReserva = async (reservaId, bloqueId, fecha) => {
  const client = await getConnection();
  try {
      const query = `
          UPDATE reservas
          SET instalacion_bloque_periodico_id = $1
          WHERE id = $2
      `;
      await client.query(query, [bloqueId, reservaId]);
  } catch (error) {
      console.error('Error al modificar reserva:', error);
      throw error;
  } finally {
      client.release();
  }
};

// Eliminar una reserva para administradores
exports.eliminarReserva = async (reservaId) => {
  const client = await getConnection();
  try {
      // Cambiar disponibilidad del bloque a true antes de eliminar la reserva
      await client.query('BEGIN'); // Inicia la transacción

      const reservaQuery = `
          SELECT instalacion_bloque_periodico_id 
          FROM reservas 
          WHERE id = $1
      `;
      const reservaResult = await client.query(reservaQuery, [reservaId]);
      const instalacionBloquePeriodicoId = reservaResult.rows[0].instalacion_bloque_periodico_id;

      const liberarBloqueQuery = `
          UPDATE instalaciones_bloques_periodicos
          SET disponible = true
          WHERE id = $1
      `;
      await client.query(liberarBloqueQuery, [instalacionBloquePeriodicoId]);

      const eliminarReservaQuery = `
          DELETE FROM reservas 
          WHERE id = $1
      `;
      await client.query(eliminarReservaQuery, [reservaId]);

      await client.query('COMMIT'); // Finaliza la transacción
  } catch (error) {
      await client.query('ROLLBACK'); // Revierte en caso de error
      console.error('Error al eliminar reserva:', error);
      throw error;
  } finally {
      client.release();
  }
};

// models/reservasModel.js
exports.eliminarYLiberarReserva = async (reservaId) => {
  const client = await getConnection();
  try {
    // Obtener el bloque asociado a la reserva
    const result = await client.query(`
      SELECT instalacion_bloque_periodico_id
      FROM reservas
      WHERE id = $1
    `, [reservaId]);

    const bloqueId = result.rows[0]?.instalacion_bloque_periodico_id;

    if (bloqueId) {
      // Liberar la disponibilidad del bloque
      await client.query(`
        UPDATE instalaciones_bloques_periodicos
        SET disponible = TRUE
        WHERE id = $1
      `, [bloqueId]);
    }

    // Eliminar la reserva
    await client.query(`
      DELETE FROM reservas
      WHERE id = $1
    `, [reservaId]);

  } catch (error) {
    console.error('Error al eliminar y liberar la reserva:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Resumen de disponibilidad en un rango de fechas
exports.getDisponibilidadPorRango = async (instalacionId, startDate, endDate) => {
  const client = await getConnection();
  try {
      const query = `
          SELECT ibp.fecha, ibp.disponible, bt.hora_inicio, bt.hora_fin
          FROM instalaciones_bloques_periodicos ibp
          JOIN bloques_tiempo_estandar bt ON ibp.bloque_tiempo_id = bt.id
          WHERE ibp.instalacion_id = $1 AND ibp.fecha BETWEEN $2 AND $3
          ORDER BY ibp.fecha, bt.hora_inicio
      `;
      const result = await client.query(query, [instalacionId, startDate, endDate]);
      return result.rows;
  } catch (error) {
      console.error('Error al obtener disponibilidad:', error);
      throw error;
  } finally {
      client.release();
  }
};

// Obtener detalles de una reserva
exports.obtenerDetallesReserva = async (reservaId) => {
    const client = await getConnection();
    try {
      const query = `
        SELECT 
          i.nombre AS instalacion,
          ibp.fecha,
          b.hora_inicio,
          b.hora_fin
        FROM reservas r
        INNER JOIN instalaciones_bloques_periodicos ibp ON r.instalacion_bloque_periodico_id = ibp.id
        INNER JOIN instalaciones i ON ibp.instalacion_id = i.id
        INNER JOIN bloques_tiempo_estandar b ON ibp.bloque_tiempo_id = b.id
        WHERE r.id = $1
      `;
      const { rows } = await client.query(query, [reservaId]);
      return rows[0];
    } catch (error) {
      console.error('Error al obtener detalles de la reserva:', error);
      throw error;
    } finally {
      client.release();
    }
};
  
// Obtener el correo de un usuario
exports.obtenerCorreoUsuario = async (usuarioId) => {
    const client = await getConnection();
    try {
      const query = `
        SELECT correo FROM usuarios WHERE id = $1
      `;
      const { rows } = await client.query(query, [usuarioId]);
      return rows[0].correo;
    } catch (error) {
      console.error('Error al obtener el correo del usuario:', error);
      throw error;
    } finally {
      client.release();
    }
};

// Obtener el número de reservas de un usuario en una fecha específica
exports.contarReservasPorFecha = async (usuarioId, fecha) => {
  const client = await getConnection();
  try {
      const query = `
          SELECT COUNT(*) AS total
          FROM reservas r
          INNER JOIN instalaciones_bloques_periodicos ibp ON r.instalacion_bloque_periodico_id = ibp.id
          WHERE r.usuario_id = $1 AND ibp.fecha::date = $2
      `;
      const { rows } = await client.query(query, [usuarioId, fecha]);
      return parseInt(rows[0].total, 10);
  } catch (error) {
      console.error('Error al contar las reservas:', error);
      throw error;
  } finally {
      client.release();
  }
};


// Obtener bloque por su ID
exports.obtenerBloquePorId = async (bloqueId) => {
  const client = await getConnection();
  try {
      const query = `
          SELECT fecha
          FROM instalaciones_bloques_periodicos
          WHERE id = $1
      `;
      const { rows } = await client.query(query, [bloqueId]);
      return rows[0];
  } catch (error) {
      console.error('Error al obtener el bloque por ID:', error);
      throw error;
  } finally {
      client.release();
  }
};

exports.crearReservaPorPagoExitoso = async (buyOrder) => {
  const client = await getConnection();
  try {
      // Encuentra la reserva asociada al buyOrder
      const reservaQuery = `
          SELECT reserva_id, instalacion_bloque_periodico_id, usuario_id
          FROM pagos
          WHERE transaccion_id = $1
      `;
      const { rows } = await client.query(reservaQuery, [buyOrder]);

      if (rows.length === 0) {
          throw new Error('Reserva asociada al pago no encontrada.');
      }

      const { reserva_id, instalacion_bloque_periodico_id, usuario_id } = rows[0];

      // Marca el bloque como no disponible
      const updateDisponibilidadQuery = `
          UPDATE instalaciones_bloques_periodicos
          SET disponible = FALSE
          WHERE id = $1
      `;
      await client.query(updateDisponibilidadQuery, [instalacion_bloque_periodico_id]);

      // Retorna información para la confirmación
      return { reservaId: reserva_id, usuarioId: usuario_id };
  } catch (error) {
      console.error('Error al crear reserva por pago exitoso:', error);
      throw error;
  } finally {
      client.release();
  }
};
