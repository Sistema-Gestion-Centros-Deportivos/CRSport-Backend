const bloquesModel = require('../models/bloquesModel');

// Crear un nuevo bloque estándar
exports.crearBloqueEstandar = async (req, res) => {
    const { bloque, horaInicio, horaFin } = req.body;
    try {
        const nuevoBloque = await bloquesModel.crearBloqueEstandar(bloque, horaInicio, horaFin);
        res.status(201).json(nuevoBloque);
    } catch (error) {
        console.error('Error al crear el bloque estándar:', error);
        res.status(500).json({ error: 'Error al crear el bloque estándar' });
    }
};

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

// Actualizar un bloque estándar
exports.actualizarBloqueEstandar = async (req, res) => {
    const { id } = req.params;
    const { horaInicio, horaFin } = req.body;
    try {
        const bloqueActualizado = await bloquesModel.actualizarBloqueEstandar(id, horaInicio, horaFin);
        res.json(bloqueActualizado);
    } catch (error) {
        console.error('Error al actualizar el bloque estándar:', error);
        res.status(500).json({ error: 'Error al actualizar el bloque estándar' });
    }
};

// Eliminar un bloque estándar
exports.eliminarBloqueEstandar = async (req, res) => {
    const { id } = req.params;
    try {
        await bloquesModel.eliminarBloqueEstandar(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar el bloque estándar:', error);
        res.status(500).json({ error: 'Error al eliminar el bloque estándar' });
    }
};

// Obtener todos los bloques de tiempo de una instalación específica
exports.obtenerBloquesPorInstalacion = async (req, res) => {
    const { instalacionId } = req.params;
    try {
        const bloques = await bloquesModel.getBloquesPorInstalacion(instalacionId);
        res.json(bloques);
    } catch (error) {
        console.error('Error al obtener los bloques de la instalación:', error);
        res.status(500).json({ error: 'Error al obtener los bloques de la instalación' });
    }
};

exports.generarBloquesPorRango = async (req, res) => {
    const { instalacionId, fechaInicio, fechaFin } = req.body;
    try {
        await bloquesModel.generarBloquesPorRango(instalacionId, fechaInicio, fechaFin);
        res.status(200).json({ message: 'Bloques generados exitosamente para el rango de fechas' });
    } catch (error) {
        console.error('Error al generar bloques por rango:', error);
        res.status(500).json({ error: 'Error al generar bloques por rango de fechas' });
    }
};

// Actualizar la disponibilidad de un bloque de tiempo específico
exports.actualizarDisponibilidadBloque = async (req, res) => {
    const { instalacionId, bloqueId, fecha, disponible } = req.body;
    try {
        const bloqueActualizado = await bloquesModel.actualizarDisponibilidadBloque(instalacionId, bloqueId, fecha, disponible);
        res.json(bloqueActualizado);
    } catch (error) {
        console.error('Error al actualizar la disponibilidad del bloque:', error);
        res.status(500).json({ error: 'Error al actualizar la disponibilidad del bloque' });
    }
};

// Eliminar bloques de tiempo de una instalación en una fecha específica
exports.eliminarBloquesDeInstalacion = async (req, res) => {
    const { instalacionId, fecha } = req.body;
    try {
        await bloquesModel.eliminarBloquesDeInstalacion(instalacionId, fecha);
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar los bloques de la instalación:', error);
        res.status(500).json({ error: 'Error al eliminar los bloques de la instalación' });
    }
};

// Consultar disponibilidad de bloques para una fecha específica
exports.consultarDisponibilidad = async (req, res) => {
    const { instalacionId, fecha } = req.params;
    try {
        const disponibilidad = await bloquesModel.getDisponibilidadBloques(instalacionId, fecha);
        res.json(disponibilidad);
    } catch (error) {
        console.error('Error al consultar disponibilidad:', error);
        res.status(500).json({ error: 'Error al consultar disponibilidad' });
    }
};

// Consultar estado de un bloque específico en una instalación y fecha
exports.consultarEstadoBloque = async (req, res) => {
    const { instalacionId, bloqueId, fecha } = req.params;
    try {
        const estado = await bloquesModel.getEstadoBloque(instalacionId, bloqueId, fecha);
        res.json(estado);
    } catch (error) {
        console.error('Error al consultar el estado del bloque:', error);
        res.status(500).json({ error: 'Error al consultar el estado del bloque' });
    }
};

exports.bloquearBloque = async (req, res) => {
    const { instalacionId } = req.params;
    const { bloque_tiempo_id, fecha } = req.body;
    try {
        await bloquesModel.bloquearBloque(instalacionId, bloque_tiempo_id, fecha);
        res.status(200).json({ message: 'Bloque de tiempo bloqueado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al bloquear el bloque de tiempo' });
    }
};

exports.liberarBloque = async (req, res) => {
    const { instalacionId, bloque_tiempo_id } = req.params;
    const { fecha } = req.query;

    try {
        await bloquesModel.liberarBloque(instalacionId, bloque_tiempo_id, fecha);
        res.status(200).json({ message: 'Bloque de tiempo liberado exitosamente' });
    } catch (error) {
        if (error.message === 'Bloque no encontrado') {
            res.status(404).json({ error: 'Bloque de tiempo no encontrado' });
        } else {
            res.status(500).json({ error: 'Error al liberar el bloque de tiempo' });
        }
    }
};
