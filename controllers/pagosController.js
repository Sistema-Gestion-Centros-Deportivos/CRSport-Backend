const { WebpayPlus } = require('transbank-sdk');
const pagosModel = require('../models/pagosModel');

// Iniciar una transacción
exports.iniciarPago = async (req, res) => {
    const { usuarioId, reservaId, monto } = req.body;

    try {
        const transaction = new WebpayPlus.Transaction();
        const buyOrder = `order-${Date.now()}`; // Genera un identificador único
        const sessionId = `session-${usuarioId}`;
        const returnUrl = `${process.env.BASE_URL}/pagos/confirmacion`;
        const finalUrl = `${process.env.BASE_URL}/pagos/resultado`;

        // Crear transacción en Webpay Plus
        const response = await transaction.create(buyOrder, sessionId, monto, returnUrl);

        // Guardar pago en la base de datos como "pendiente"
        await pagosModel.crearPago(usuarioId, reservaId, monto, 'pendiente', response.token);

        res.status(200).json({ url: response.url, token: response.token });
    } catch (error) {
        console.error('Error al iniciar el pago:', error);
        res.status(500).json({ error: 'Error al iniciar el pago' });
    }
};

// Confirmar transacción
exports.confirmarPago = async (req, res) => {
    const { token_ws } = req.body;

    try {
        const transaction = new WebpayPlus.Transaction();
        const response = await transaction.commit(token_ws);

        // Actualizar estado del pago según respuesta de Transbank
        const estado = response.status === 'AUTHORIZED' ? 'completado' : 'fallido';
        await pagosModel.actualizarEstadoPago(token_ws, estado);

        res.status(200).json({ message: 'Pago confirmado', response });
    } catch (error) {
        console.error('Error al confirmar el pago:', error);
        res.status(500).json({ error: 'Error al confirmar el pago' });
    }
};

// Resultado de transacción
exports.resultadoPago = async (req, res) => {
    const { token_ws } = req.query;

    try {
        const transaction = new WebpayPlus.Transaction();
        const response = await transaction.status(token_ws);

        res.status(200).json({ response });
    } catch (error) {
        console.error('Error al obtener el estado del pago:', error);
        res.status(500).json({ error: 'Error al obtener el estado del pago' });
    }
};
