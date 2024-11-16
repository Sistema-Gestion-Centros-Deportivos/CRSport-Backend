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
