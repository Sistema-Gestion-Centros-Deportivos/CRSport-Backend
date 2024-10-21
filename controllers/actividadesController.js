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

// asignar actividad a instalacion
exports.asignarActividadAInstalacion = async (req, res) => {
  const { instalacion_id, actividad_id } = req.body;
  try {
    const result = await actividadesModel.asignarActividadAInstalacion(instalacion_id, actividad_id);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error al asignar actividad a instalación:', error);
    res.status(500).json({ error: 'Error al asignar actividad a instalación' });
  }
};