const { getConnection } = require('../config/db');

exports.crearPago = async (usuarioId, reservaId, monto, estado, transaccionId) => {
    const client = await getConnection();
    try {
        const query = `
            INSERT INTO pagos (usuario_id, reserva_id, monto, estado, transaccion_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        `;
        const { rows } = await client.query(query, [usuarioId, reservaId, monto, estado, transaccionId]);
        return rows[0].id;
    } catch (error) {
        console.error('Error al crear el pago:', error);
        throw error;
    } finally {
        client.release();
    }
};

exports.actualizarEstadoPago = async (transaccionId, estado) => {
    const client = await getConnection();
    try {
        const query = `
            UPDATE pagos SET estado = $1, actualizado_en = NOW()
            WHERE transaccion_id = $2
        `;
        await client.query(query, [estado, transaccionId]);
    } catch (error) {
        console.error('Error al actualizar el estado del pago:', error);
        throw error;
    } finally {
        client.release();
    }
};

exports.obtenerReservaPorTransaccion = async (transaccionId) => {
    const client = await getConnection();
    try {
      const query = `
        SELECT reserva_id FROM pagos WHERE transaccion_id = $1
      `;
      const { rows } = await client.query(query, [transaccionId]);
      return rows.length ? rows[0].reserva_id : null;
    } catch (error) {
      console.error('Error al obtener reserva por transacción:', error);
      throw error;
    } finally {
      client.release();
    }
  };
  
  // Actualizar pago exitoso
exports.actualizarPagoExitoso = async (token) => {
    const client = await getConnection();
    try {
        const query = `
            UPDATE pagos
            SET estado = 'completado', actualizado_en = NOW()
            WHERE transaccion_id = $1
            RETURNING *
        `;
        const result = await client.query(query, [token]);
        return result.rows[0];
    } finally {
        client.release();
    }
};

// Actualizar pago fallido
exports.actualizarPagoFallido = async (token) => {
    const client = await getConnection();
    try {
        const query = `
            UPDATE pagos
            SET estado = 'fallido', actualizado_en = NOW()
            WHERE transaccion_id = $1
            RETURNING *
        `;
        const result = await client.query(query, [token]);
        return result.rows[0];
    } finally {
        client.release();
    }
};

exports.obtenerPagoPorToken = async (token) => {
    const client = await getConnection();
    try {
        const query = `
            SELECT * FROM pagos WHERE transaccion_id = $1 AND estado = 'pendiente'
        `;
        const result = await client.query(query, [token]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al obtener pago por token:', error);
        throw error;
    } finally {
        client.release();
    }
};

exports.actualizarEstadoPago = async (pagoId, nuevoEstado) => {
    const client = await getConnection();
    try {
        const query = `
            UPDATE pagos SET estado = $1, actualizado_en = NOW()
            WHERE id = $2
        `;
        await client.query(query, [nuevoEstado, pagoId]);
    } catch (error) {
        console.error('Error al actualizar estado del pago:', error);
        throw error;
    } finally {
        client.release();
    }
};

exports.obtenerBloqueAsociado = async (sessionId) => {
    const client = await getConnection();
    try {
        const query = `
            SELECT instalacion_bloque_periodico_id 
            FROM pagos 
            WHERE session_id = $1
        `;
        const result = await client.query(query, [sessionId]);
        return result.rows[0]?.instalacion_bloque_periodico_id;
    } catch (error) {
        console.error('Error al obtener bloque asociado:', error);
        throw error;
    } finally {
        client.release();
    }
};


exports.actualizarPagoPorToken = async (token, estado) => {
    const client = await getConnection();
    try {
        const query = `
            UPDATE pagos
            SET estado = $1, actualizado_en = NOW()
            WHERE transaccion_id = $2
        `;
        await client.query(query, [estado, token]);
    } catch (error) {
        console.error('Error al actualizar el estado del pago:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Obtener reserva_id por token de transacción
exports.obtenerReservaIdPorToken = async (token) => {
    const client = await getConnection();
    try {
      const query = `
        SELECT reserva_id
        FROM pagos
        WHERE transaccion_id = $1
      `;
      const result = await client.query(query, [token]);
      return result.rows[0]?.reserva_id || null;
    } catch (error) {
      console.error('Error al obtener reserva por token:', error);
      throw error;
    } finally {
      client.release();
    }
};

// Actualizar estado del pago
exports.actualizarEstadoPago = async (token, nuevoEstado) => {
    const client = await getConnection();
    try {
        const query = `
            UPDATE pagos
            SET estado = $1, actualizado_en = NOW()
            WHERE transaccion_id = $2
        `;
        await client.query(query, [nuevoEstado, token]);
    } catch (error) {
        console.error('Error al actualizar el estado del pago:', error);
        throw error;
    } finally {
        client.release();
    }
};