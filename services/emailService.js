const nodemailer = require('nodemailer');

// Configuración del transportador
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Función para formatear la fecha
const formatFecha = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Función para enviar correos de confirmación
exports.enviarCorreoReserva = async (correo, reservaDetalles) => {
  const fechaFormateada = formatFecha(reservaDetalles.fecha);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: 'Confirmación de Reserva',
    html: `
      <h1>Reserva Confirmada</h1>
      <p>Gracias por reservar con nosotros.</p>
      <p><strong>Detalles de la reserva:</strong></p>
      <ul>
        <li>Instalación: ${reservaDetalles.instalacion}</li>
        <li>Fecha: ${fechaFormateada}</li>
        <li>Hora: ${reservaDetalles.hora_inicio} - ${reservaDetalles.hora_fin}</li>
      </ul>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado a:', correo);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};
