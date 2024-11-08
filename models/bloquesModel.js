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

// Generar bloques en un rango de fechas para una instalación
exports.generarBloquesPorRango = async (instalacionId, fechaInicio, fechaFin) => {
    const client = await getConnection();
    try {
        const bloques = await this.getBloquesEstandar(); // Obtener los bloques de tiempo estándar
        const query = `
            INSERT INTO instalaciones_bloques_periodicos (instalacion_id, bloque_tiempo_id, fecha, disponible)
            VALUES ($1, $2, $3, TRUE)
            ON CONFLICT (instalacion_id, bloque_tiempo_id, fecha) DO NOTHING
        `;

        let currentDate = new Date(fechaInicio);
        const endDate = new Date(fechaFin);

        while (currentDate <= endDate) {
            const fechaActual = currentDate.toISOString().split('T')[0]; // Formato yyyy-mm-dd

            // Recorremos los bloques para cada fecha
            for (let bloque of bloques) {
                // Intentamos insertar, y si el registro ya existe, lo saltamos
                await client.query(query, [instalacionId, bloque.id, fechaActual]);
            }
            
            // Avanza al siguiente día
            currentDate.setDate(currentDate.getDate() + 1);
        }
    } catch (error) {
        console.error('Error al generar bloques por rango:', error);
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
