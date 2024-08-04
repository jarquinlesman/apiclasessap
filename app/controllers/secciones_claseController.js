const db = require('../config/db');

const seccion = async (req, res) => {
    const { id_clase, id_periodo } = req.params;

    const query = `
    SELECT 
        c.id_clase,
        c.nombre_clase AS Clase,
        c.creditos,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'seccion', dp.seccion,
                'hora_inicio', dp.hora_inicio
            )
        ) AS Secciones
    FROM 
        clases c
    LEFT JOIN 
        carrera_clase_bloque ccb ON c.id_clase = ccb.id_clase
    LEFT JOIN 
        detalle_periodo dp ON ccb.id_ccb = dp.id_ccb
    WHERE 
        c.id_clase = ? 
        AND dp.id_periodo = ?
    GROUP BY 
        c.id_clase,
        c.nombre_clase,
        c.creditos
    ORDER BY 
        c.nombre_clase;
    `;

    try {
        const [rows] = await db.query(query, [id_clase, id_periodo]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    }
}

module.exports = { seccion };