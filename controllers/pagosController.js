const { WebpayPlus } = require('transbank-sdk');
const pagosModel = require('../models/pagosModel');
const reservasModel = require('../models/reservasModel');
const { enviarCorreoReserva } = require('../services/emailService');

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
    const { token_ws } = req.query;

    try {
        const transaction = new WebpayPlus.Transaction();
        const response = await transaction.commit(token_ws);

        if (response.status === 'AUTHORIZED') {
            // Obtener reserva asociada al token
            const reservaId = await pagosModel.obtenerReservaIdPorToken(token_ws);

            if (!reservaId) {
                return res.status(404).json({ error: 'Reserva no encontrada para el token proporcionado' });
            }

            // Confirmar la reserva
            await reservasModel.confirmarReserva(reservaId);

            // Actualizar el estado del pago
            await pagosModel.actualizarEstadoPago(token_ws, 'completado');

            // Obtener el usuario asociado a la reserva
            const usuario_id = await reservasModel.obtenerUsuarioPorReserva(reservaId);
            if (!usuario_id) {
                console.error('Usuario no encontrado para la reserva:', reservaId);
                return res.status(404).json({ error: 'Usuario no encontrado para la reserva' });
            }

            // Enviar correo de confirmación
            const detallesReserva = await reservasModel.obtenerDetallesReserva(reservaId);
            const userCorreo = await reservasModel.obtenerCorreoUsuario(usuario_id);
            await enviarCorreoReserva(userCorreo, detallesReserva);

            res.redirect(`${process.env.FRONTEND_URL}/pagos/detalles/${token_ws}`);
        } else {
        await pagosModel.actualizarEstadoPago(token_ws, 'fallido');
        res.redirect(`${process.env.FRONTEND_URL}/pagos/error`);
        }
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


exports.obtenerDetallesPago = async (req, res) => {
    const { token_ws } = req.params;
  
    try {
      const detalles = await pagosModel.obtenerDetallesTransaccion(token_ws);
      if (!detalles) {
        return res.status(404).json({ error: 'Detalles de la transacción no encontrados' });
      }
      res.status(200).json(detalles);
    } catch (error) {
      console.error('Error al obtener los detalles del pago:', error);
      res.status(500).json({ error: 'Error al obtener los detalles del pago' });
    }
};
  
