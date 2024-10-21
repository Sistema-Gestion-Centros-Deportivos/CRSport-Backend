// bloquesTiempoModel.js
const { getConnection } = require('../config/db');

// Crear un nuevo bloque de tiempo si no existe
exports.createBloqueTiempo = async (instalacion_id, bloque, hora_inicio, hora_fin, disponible = true) => {
    const client = await getConnection();
    try {
      // Verificar si el bloque ya existe
      const exists = await this.existsBloqueTiempo(instalacion_id, bloque, hora_inicio, hora_fin);
      if (exists) {
        throw new Error('El bloque de tiempo ya existe.');
      }
  
      // Crear el nuevo bloque si no existe
      const result = await client.query(
        'INSERT INTO bloques_tiempo (instalacion_id, bloque, hora_inicio, hora_fin, disponible) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [instalacion_id, bloque, hora_inicio, hora_fin, disponible]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al crear el bloque de tiempo:', error);
      throw error;
    } finally {
      client.release();
    }
};


// obtener todos los bloques de tiempo
exports.getAllBloquesTiempo = async () => {
    const client = await getConnection();
    try {
      const result = await client.query('SELECT * FROM bloques_tiempo');
      return result.rows;
    }
    catch (error) {
      console.error('Error al obtener los bloques de tiempo:', error);
      throw error;
    }
    finally {
      client.release();
    }
};

// Obtener bloques de tiempo por instalación
exports.getBloquesByInstalacion = async (instalacion_id) => {
    const client = await getConnection();
    try {
        const result = await client.query('SELECT * FROM bloques_tiempo WHERE instalacion_id = $1', [instalacion_id]);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener los bloques de tiempo:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Verificar si un bloque de tiempo ya existe con los mismos detalles
exports.existsBloqueTiempo = async (instalacion_id, bloque, hora_inicio, hora_fin) => {
    const client = await getConnection();
    try {
      const result = await client.query(
        'SELECT * FROM bloques_tiempo WHERE instalacion_id = $1 AND bloque = $2 AND hora_inicio = $3 AND hora_fin = $4',
        [instalacion_id, bloque, hora_inicio, hora_fin]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error al verificar la existencia del bloque de tiempo:', error);
      throw error;
    } finally {
      client.release();
    }
  };


// Actualizar un bloque de tiempo
exports.updateBloqueTiempo = async (id, updates) => {
    const client = await getConnection();
    try {
      const fields = [];
      const values = [];
      let index = 1;
  
      // Recorre los campos proporcionados y solo agrega los que tienen valor (no undefined o null)
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined && value !== null) {
          fields.push(`${key} = $${index}`);
          values.push(value);
          index++;
        }
      }
  
      // Si no se proporcionan campos para actualizar, devuelve un error
      if (fields.length === 0) {
        throw new Error('No se proporcionaron campos para actualizar.');
      }
  
      values.push(id); // Añadir el ID del bloque de tiempo al final para la condición WHERE
      const sql = `UPDATE bloques_tiempo SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
  
      // Ejecutar la consulta de actualización
      const result = await client.query(sql, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al actualizar el bloque de tiempo:', error);
      throw error; // Lanza el error para que lo maneje el controlador
    } finally {
      client.release();
    }
};


// Eliminar un bloque de tiempo
exports.deleteBloqueTiempo = async (id) => {
    const client = await getConnection();
    try {
      const result = await client.query('DELETE FROM bloques_tiempo WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar el bloque de tiempo:', error);
      throw error;
    } finally {
      client.release();
    }
  };