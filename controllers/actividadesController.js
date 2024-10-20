const actividadesModel = require('../models/actividadesModel');

exports.obtenerActividades = async (req, res) => {
  try {
    const actividades = await actividadesModel.getAllActividades();
    res.json(actividades);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
};
