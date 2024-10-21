const { getConnection } = require('../config/db');

// Obtener todos los bloques estándar
exports.getBloquesEstandar = async () => {
    const client = await getConnection();
    try {
        const result = await client.query('SELECT * FROM bloques_tiempo_estandar');
        return result.rows;
    } catch (error) {
        console.error('Error al obtener los bloques estándar:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Generar bloques semanales para una instalación
exports.generarBloquesSemanales = async (instalacionId, fechaSemana) => {
    const client = await getConnection();
    try {
        const bloques = await this.getBloquesEstandar();
        const query = `
            INSERT INTO instalaciones_bloques_semanales (instalacion_id, bloque_tiempo_id, fecha_semana, disponible)
            VALUES ($1, $2, $3, TRUE)
        `;

        for (let bloque of bloques) {
            await client.query(query, [instalacionId, bloque.id, fechaSemana]);
        }
    } catch (error) {
        console.error('Error al generar bloques semanales:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Obtener disponibilidad de bloques por semana e instalación
exports.getDisponibilidadPorSemana = async (instalacionId, fechaSemana) => {
    const client = await getConnection();
    try {
        const query = `
            SELECT bt.id, bt.hora_inicio, bt.hora_fin, ibs.disponible
            FROM bloques_tiempo_estandar bt
            JOIN instalaciones_bloques_semanales ibs ON bt.id = ibs.bloque_tiempo_id
            WHERE ibs.instalacion_id = $1 AND ibs.fecha_semana = $2
        `;
        const result = await client.query(query, [instalacionId, fechaSemana]);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener disponibilidad:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Reservar un bloque
exports.reservarBloque = async (instalacionId, bloqueTiempoId, fechaSemana) => {
    const client = await getConnection();
    try {
        const query = `
            UPDATE instalaciones_bloques_semanales
            SET disponible = FALSE
            WHERE instalacion_id = $1 AND bloque_tiempo_id = $2 AND fecha_semana = $3 AND disponible = TRUE
        `;
        const result = await client.query(query, [instalacionId, bloqueTiempoId, fechaSemana]);

        if (result.rowCount === 0) {
            throw new Error('Bloque no disponible');
        }
    } catch (error) {
        console.error('Error al reservar el bloque:', error);
        throw error;
    } finally {
        client.release();
    }
};
