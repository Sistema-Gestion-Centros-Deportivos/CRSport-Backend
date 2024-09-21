const Instalacion = require('../models/instalacionesModel');

exports.getInstalaciones = async (req, res) => {
  try {
    const instalaciones = await Instalacion.getAll();
    res.json(instalaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener instalaciones' });
  }
};

exports.createInstalacion = async (req, res) => {
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  try {
    const { nombre, descripcion, ubicacion, disponible_desde, disponible_hasta } = req.body;
    const result = await Instalacion.create(nombre, descripcion, ubicacion, disponible_desde, disponible_hasta);
    res.status(201).json({ message: 'Instalación creada exitosamente', instalacionId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear instalación' });
  }
};
