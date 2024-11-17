const { WebpayPlus } = require('transbank-sdk');
const pagosModel = require('../models/pagosModel');
const reservasModel = require('../models/reservasModel');

// Iniciar una transacción
exports.iniciarPago = async (req, res) => {
    const { usuarioId, reservaId, monto } = req.body;

    try {
        const transaction = new WebpayPlus.Transaction();
        const buyOrder = `order-${Date.now()}`; // Genera un identificador único
        const sessionId = `session-${usuarioId}`;
        const returnUrl = `${process.env.BASE_URL}/pagos/confirmar`;
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
    const { token_ws } = req.query; // Transbank envía el token en el query string

    if (!token_ws) {
        return res.status(400).send('Token de pago no proporcionado.');
    }

    try {
        // Confirma el pago con el SDK
        const transaction = new WebpayPlus.Transaction();
        const result = await transaction.commit(token_ws);

        // Actualiza el estado del pago en la base de datos
        const estado = result.status === 'AUTHORIZED' ? 'completado' : 'fallido';
        await pagosModel.actualizarPagoPorToken(token_ws, estado);

        // Actualiza la disponibilidad del bloque si el pago fue exitoso
        if (estado === 'completado') {
            await reservasModel.crearReservaPorPagoExitoso(result.buy_order);
        }

        // Muestra un mensaje de confirmación en el navegador
        res.send(`
            <html>
                <body>
                    <h1>Pago ${estado === 'completado' ? 'Completado' : 'Fallido'}</h1>
                    <p>Detalles:</p>
                    <pre>${JSON.stringify(result, null, 2)}</pre>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error al confirmar el pago:', error);
        res.status(500).send('Ocurrió un error al procesar el pago.');
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
