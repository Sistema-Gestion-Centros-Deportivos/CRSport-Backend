// authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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

