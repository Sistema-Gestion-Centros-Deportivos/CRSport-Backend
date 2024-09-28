// authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware para autenticar al usuario mediante token
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar si el usuario es administrador
exports.isAdmin = (req, res, next) => {
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};
