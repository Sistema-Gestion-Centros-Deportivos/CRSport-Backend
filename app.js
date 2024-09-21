// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Habilitar CORS para todas las solicitudes
app.use(cors());

app.use(bodyParser.json());

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'gestion'
};

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Ruta de registro
app.post('/register', async (req, res) => {
  try {
    const { correo, contraseña, rol } = req.body;
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO usuarios (correo, contraseña, rol) VALUES (?, ?, ?)',
      [correo, hashedPassword, rol]
    );
    
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    
    const user = rows[0];
    if (await bcrypt.compare(contraseña, user.contraseña)) {
      const token = jwt.sign({ userId: user.id, rol: user.rol }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(400).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Ruta para obtener instalaciones
app.get('/instalaciones', authenticateToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM instalaciones');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener instalaciones' });
  }
});

app.get('/test', (req, res) => {
    res.json({ message: 'El servidor está funcionando correctamente' });
  });

// Ruta para crear una instalación (solo para administradores)
app.post('/instalaciones', authenticateToken, async (req, res) => {
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  
  try {
    const { nombre, descripcion, ubicacion, disponible_desde, disponible_hasta } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO instalaciones (nombre, descripcion, ubicacion, disponible_desde, disponible_hasta) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, ubicacion, disponible_desde, disponible_hasta]
    );
    
    res.status(201).json({ message: 'Instalación creada exitosamente', instalacionId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear instalación' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});