const db = require('../config/db.js');

const clases_carrera = async (req, res) => {
    const { id_carrera } = req.params;

    const query = `
      SELECT 
          b.id_bloque, 
          b.nombre_bloque AS bloque,
          GROUP_CONCAT(
              JSON_OBJECT(
                  'id_clase', c.id_clase,
                  'nombre_clase', c.nombre_clase,
                  'creditos', c.creditos,
                  'secciones', (
                      SELECT 
                          GROUP_CONCAT(
                              JSON_OBJECT(
                                  'seccion', dp.seccion,
                                  'catedratico', ct.nombre_catedratico,
                                  'hora_inicio', dp.hora_inicio
                              )
                              SEPARATOR ','
                          )
                      FROM 
                          detalle_periodo dp
                          LEFT JOIN catedraticos ct ON dp.id_catedratico = ct.id_catedratico
                      WHERE 
                          dp.id_ccb = ccb.id_ccb
                          AND dp.id_periodo = (
                              SELECT id_periodo 
                              FROM periodos 
                              ORDER BY fecha_inicio DESC 
                              LIMIT 1
                          )
                  )
              )
              SEPARATOR ','
          ) AS clases
      FROM 
          bloques b
          LEFT JOIN 
              carrera_clase_bloque ccb ON b.id_bloque = ccb.id_bloque
          LEFT JOIN 
              clases c ON ccb.id_clase = c.id_clase
      WHERE 
          ccb.id_carrera = ?
      GROUP BY 
          b.id_bloque, 
          b.nombre_bloque;
    `;
  
    try {
      const [rows] = await db.query(query, [id_carrera]);
  
      rows.forEach(row => {
        if (row.clases) {
          row.clases = JSON.parse(`[${row.clases}]`);
        }
      });
  
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener las clases');
    }
  };

module.exports = { clases_carrera };