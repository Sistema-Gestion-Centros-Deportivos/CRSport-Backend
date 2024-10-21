const bloquesModel = require('../models/bloquesModel');

// Obtener todos los bloques estándar
exports.obtenerBloquesEstandar = async (req, res) => {
    try {
        const bloques = await bloquesModel.getBloquesEstandar();
        res.json(bloques);
    } catch (error) {
        console.error('Error al obtener los bloques estándar:', error);
        res.status(500).json({ error: 'Error al obtener los bloques estándar' });
    }
};

// Generar bloques semanales
exports.generarBloquesSemanales = async (req, res) => {
    const { instalacionId, fechaSemana } = req.body;
    try {
        await bloquesModel.generarBloquesSemanales(instalacionId, fechaSemana);
        res.status(200).json({ message: 'Bloques semanales generados exitosamente' });
    } catch (error) {
        console.error('Error al generar bloques semanales:', error);
        res.status(500).json({ error: 'Error al generar bloques semanales' });
    }
};

// Obtener disponibilidad de bloques por semana
exports.obtenerDisponibilidad = async (req, res) => {
    const { instalacionId, fechaSemana } = req.params;
    try {
        const disponibilidad = await bloquesModel.getDisponibilidadPorSemana(instalacionId, fechaSemana);
        res.json(disponibilidad);
    } catch (error) {
        console.error('Error al obtener disponibilidad:', error);
        res.status(500).json({ error: 'Error al obtener disponibilidad' });
    }
};

// Reservar un bloque
exports.reservarBloque = async (req, res) => {
    const { instalacionId, bloqueTiempoId, fechaSemana } = req.body;
    try {
        await bloquesModel.reservarBloque(instalacionId, bloqueTiempoId, fechaSemana);
        res.status(200).json({ message: 'Reserva exitosa' });
    } catch (error) {
        console.error('Error al reservar el bloque:', error);
        res.status(400).json({ error: error.message });
    }
};
