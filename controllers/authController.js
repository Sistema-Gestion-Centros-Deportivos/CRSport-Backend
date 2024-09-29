// authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Configurar el transportador de Nodemailer con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu correo de Gmail
    pass: process.env.EMAIL_PASSWORD, // Contraseña de aplicación de Gmail
  },
});

exports.register = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    // Crear usuario con contraseña cifrada
    const nuevoUsuario = await User.createUser(nombre, correo, contraseña, rol);
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: nuevoUsuario.id });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Buscar usuario por correo
    const user = await User.findUserByEmail(correo);
    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Verificar la contraseña usando la función del modelo
    const match = await User.verifyPassword(contraseña, user.contraseña);
    if (match) {
      // Generar token con tiempo de expiración
      const token = jwt.sign(
        { userId: user.id, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Expiración del token en 1 hora
      );
      res.json({ token });
    } else {
      res.status(400).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Enviar el correo de recuperación de contraseña
exports.solicitarRecuperacionContraseña = async (req, res) => {
  const { correo } = req.body;
  try {
    // Verificar si el usuario existe
    const user = await User.findUserByEmail(correo);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Generar un token de recuperación con expiración
    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    // Enlace para restablecer contraseña
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Opciones del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Recuperación de Contraseña',
      html: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
             <a href="${resetLink}">Restablecer Contraseña</a>`,
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ error: 'Error al enviar el correo de recuperación' });
      }
      res.json({ message: 'Correo de recuperación enviado exitosamente' });
    });
  } catch (error) {
    console.error('Error al solicitar la recuperación de contraseña:', error);
    res.status(500).json({ error: 'Error al solicitar la recuperación de contraseña' });
  }
};

// authController.js
exports.restablecerContraseña = async (req, res) => {
  const { token, nuevaContraseña } = req.body;

  try {
    // Verificar el token de recuperación
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Buscar al usuario en la base de datos
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar la contraseña utilizando la función updatePassword
    await User.updatePassword(userId, nuevaContraseña);

    res.json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'El token de recuperación ha expirado' });
    }
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
};

