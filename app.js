const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const morgan = require('morgan');  // Importar morgan para logs

require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const instalacionesRoutes = require('./routes/instalacionesRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const reservasRoutes = require('./routes/reservasRoutes');
const bloquesTiempoRoutes = require('./routes/bloquesTiempoRoutes');
const actividadesRoutes = require('./routes/actividadesRoutes');
const bloquesRoutes = require('./routes/bloquesRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Middleware para logging de solicitudes HTTP
app.use(morgan('dev'));  // Esto registrará todas las solicitudes con detalles en la consola

// Middleware de autenticación y autorizaciones
const { authenticateToken, isAdmin } = require('./middlewares/authMiddleware');

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Centro de Reserva API',
      version: '1.0.1',
      description: 'End-Points for the API',
      contact: {
        name: 'Aaron Silva',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Ruta a tus archivos de rutas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Usar las rutas
app.use('/auth', authRoutes);  // Registro y Login
app.use('/instalaciones', instalacionesRoutes);  // CRUD Instalaciones
app.use('/usuarios', usuariosRoutes);  // CRUD Usuarios
app.use('/reservas', reservasRoutes); // CRUD Reservas
app.use('/bloques-tiempo', bloquesTiempoRoutes); // CRUD Bloques de Tiempo
app.use('/actividades', actividadesRoutes);
app.use('/bloques', bloquesRoutes);

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ message: 'El servidor está funcionando correctamente' });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);  // Muestra el error en la consola
  res.status(err.status || 500).json({
    message: 'Something went wrong!',
    error: err.message,
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
