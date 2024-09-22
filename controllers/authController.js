const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const result = await User.createUser(nombre, correo, hashedPassword, rol);
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const user = await User.findUserByEmail(correo);
    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (match) {
      const token = jwt.sign({ userId: user.id, rol: user.rol }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(400).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
