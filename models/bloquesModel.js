const { getConnection } = require('../config/db');

// Crear un nuevo bloque estándar
exports.crearBloqueEstandar = async (bloque, horaInicio, horaFin) => {
    const client = await getConnection();
    try {
        const query = `
            INSERT INTO bloques_tiempo_estandar (bloque, hora_inicio, hora_fin)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await client.query(query, [bloque, horaInicio, horaFin]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al crear el bloque estándar:', error);
        throw error;
    } finally {
        client.release();
    }
};

exports.obtenerInstalacionPorBloque = async (bloqueId) => {
    const client = await getConnection();
    try {
      const query = `
        SELECT i.tipo_instalacion, i.valor 
        FROM instalaciones_bloques_periodicos ibp
        JOIN instalaciones i ON ibp.instalacion_id = i.id
        WHERE ibp.id = $1
      `;
      const result = await client.query(query, [bloqueId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener la instalación por bloque:', error);
      throw error;
    } finally {
      client.release();
    }
};

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

// Actualizar un bloque estándar
exports.actualizarBloqueEstandar = async (id, horaInicio, horaFin) => {
    const client = await getConnection();
    try {
        const query = `
            UPDATE bloques_tiempo_estandar
            SET hora_inicio = $2, hora_fin = $3
            WHERE id = $1
            RETURNING *
        `;
        const result = await client.query(query, [id, horaInicio, horaFin]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al actualizar el bloque estándar:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Eliminar un bloque estándar
exports.eliminarBloqueEstandar = async (id) => {
    const client = await getConnection();
    try {
        const query = `
            DELETE FROM bloques_tiempo_estandar
            WHERE id = $1
        `;
        await client.query(query, [id]);
    } catch (error) {
        console.error('Error al eliminar el bloque estándar:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Obtener todos los bloques de tiempo de una instalación específica
exports.getBloquesPorInstalacion = async (instalacionId) => {
    const client = await getConnection();
    try {
        const query = `
            SELECT * FROM instalaciones_bloques_periodicos
            WHERE instalacion_id = $1
            ORDER BY fecha
        `;
        const result = await client.query(query, [instalacionId]);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener los bloques de la instalación:', error);
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

// Actualizar la disponibilidad de un bloque de tiempo específico
exports.actualizarDisponibilidadBloque = async (instalacionId, bloqueId, fecha, disponible) => {
    const client = await getConnection();
    try {
        const query = `
            UPDATE instalaciones_bloques_periodicos
            SET disponible = $4
            WHERE instalacion_id = $1 AND bloque_tiempo_id = $2 AND fecha = $3
            RETURNING *
        `;
        const result = await client.query(query, [instalacionId, bloqueId, fecha, disponible]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al actualizar la disponibilidad del bloque:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Actualizar la disponibilidad de un bloque de tiempo específico
exports.actualizarDisponibilidadBloque = async (instalacionId, bloqueId, fecha, disponible) => {
    const client = await getConnection();
    try {
        const query = `
            UPDATE instalaciones_bloques_periodicos
            SET disponible = $4
            WHERE instalacion_id = $1 AND bloque_tiempo_id = $2 AND fecha = $3
            RETURNING *
        `;
        const result = await client.query(query, [instalacionId, bloqueId, fecha, disponible]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al actualizar la disponibilidad del bloque:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Eliminar bloques de tiempo de una instalación en una fecha específica
exports.eliminarBloquesDeInstalacion = async (instalacionId, fecha) => {
    const client = await getConnection();
    try {
        const query = `
            DELETE FROM instalaciones_bloques_periodicos
            WHERE instalacion_id = $1 AND fecha = $2
        `;
        await client.query(query, [instalacionId, fecha]);
    } catch (error) {
        console.error('Error al eliminar los bloques de la instalación:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Obtener disponibilidad de bloques de una instalación en una fecha específica
exports.getDisponibilidadBloques = async (instalacionId, fecha) => {
    const client = await getConnection();
    try {
        const query = `
            SELECT ibp.*, bte.hora_inicio, bte.hora_fin
            FROM instalaciones_bloques_periodicos ibp
            JOIN bloques_tiempo_estandar bte ON ibp.bloque_tiempo_id = bte.id
            WHERE ibp.instalacion_id = $1 AND ibp.fecha = $2
            ORDER BY bte.hora_inicio
        `;
        const result = await client.query(query, [instalacionId, fecha]);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener disponibilidad de bloques:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Consultar estado de un bloque específico en una instalación y fecha
exports.getEstadoBloque = async (instalacionId, bloqueId, fecha) => {
    const client = await getConnection();
    try {
        const query = `
            SELECT disponible
            FROM instalaciones_bloques_periodicos
            WHERE instalacion_id = $1 AND bloque_tiempo_id = $2 AND fecha = $3
        `;
        const result = await client.query(query, [instalacionId, bloqueId, fecha]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al consultar el estado del bloque:', error);
        throw error;
    } finally {
        client.release();
    }
};

exports.bloquearBloque = async (instalacionId, bloqueTiempoId, fecha) => {
    const client = await getConnection();
    try {
        const query = `
            UPDATE instalaciones_bloques_periodicos
            SET disponible = FALSE
            WHERE instalacion_id = $1 AND bloque_tiempo_id = $2 AND fecha = $3
        `;
        await client.query(query, [instalacionId, bloqueTiempoId, fecha]);
    } catch (error) {
        console.error('Error al bloquear el bloque:', error);
        throw error;
    } finally {
        client.release();
    }
};

exports.liberarBloque = async (instalacionId, bloqueTiempoId, fecha) => {
    const client = await getConnection();
    try {
        const query = `
            UPDATE instalaciones_bloques_periodicos
            SET disponible = TRUE
            WHERE instalacion_id = $1 AND bloque_tiempo_id = $2 AND fecha = $3
        `;
        const result = await client.query(query, [instalacionId, bloqueTiempoId, fecha]);
        if (result.rowCount === 0) {
            throw new Error('Bloque no encontrado');
        }
    } catch (error) {
        console.error('Error al liberar el bloque:', error);
        throw error;
    } finally {
        client.release();
    }
};


  