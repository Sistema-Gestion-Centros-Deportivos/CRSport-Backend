// // Verificar si el usuario es administrador
// const isAdmin = (req, res, next) => {
//     if (req.user.rol !== 'administrador') {
//       return res.status(403).json({ error: 'Acceso denegado' });
//     }
//     next();
//   };
  
//   module.exports = { authenticateToken, isAdmin };

const jwt = require('jsonwebtoken');
require('dotenv').config();

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

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};

module.exports = { authenticateToken, isAdmin };
