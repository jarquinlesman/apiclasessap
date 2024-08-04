const db = require('../config/db');

const seccion = async (req, res) => {
    const { id_clase, id_periodo } = req.params;

    const query = `
    SELECT 
        c.id_clase,
        c.nombre_clase AS Clase,
        c.creditos,
        COALESCE(
            GROUP_CONCAT(
                JSON_OBJECT(
                    'seccion', dp.seccion,
                    'hora_inicio', dp.hora_inicio
                )
                SEPARATOR ','
            ),
            NULL
        ) AS Secciones
    FROM 
        clases c
    LEFT JOIN 
        carrera_clase_bloque ccb ON c.id_clase = ccb.id_clase
    LEFT JOIN 
        detalle_periodo dp ON ccb.id_ccb = dp.id_ccb AND dp.id_periodo = ?
    WHERE 
        c.id_clase = ? 
    GROUP BY 
        c.id_clase,
        c.nombre_clase,
        c.creditos
    ORDER BY 
        c.nombre_clase;
    `;

    try {
        const [rows] = await db.query(query, [id_periodo, id_clase]);

        // Procesa los resultados para manejar el caso de secciones nulas
        const processedRows = rows.map(row => {
            if (!row.Secciones) {
                return {
                    ...row,
                    Secciones: null
                };
            }
            const secciones = JSON.parse(`[${row.Secciones}]`);
            const uniqueSecciones = Array.from(new Set(secciones.map(seccion => JSON.stringify(seccion))))
                .map(seccion => JSON.parse(seccion));
            return {
                ...row,
                Secciones: uniqueSecciones.length > 0 ? uniqueSecciones : null
            };
        });

        res.json(processedRows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    }
}

module.exports = { seccion };