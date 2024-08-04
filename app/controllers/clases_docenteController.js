const db = require('../config/db');

const filtro_docente = async (req, res) => {
    const { id_catedratico, id_periodo } = req.params;

    const query = `
    SELECT 
        ct.id_catedratico,
        ct.nombre_catedratico AS Catedratico,
        c.id_clase,
        c.nombre_clase,
        c.creditos,
        GROUP_CONCAT(
            DISTINCT
            JSON_OBJECT(
                'seccion', dp.seccion,
                'hora_inicio', dp.hora_inicio
            )
            SEPARATOR ','
        ) AS secciones
    FROM 
        catedraticos ct
    JOIN 
        detalle_periodo dp ON ct.id_catedratico = dp.id_catedratico
    JOIN 
        carrera_clase_bloque ccb ON dp.id_ccb = ccb.id_ccb
    JOIN 
        clases c ON ccb.id_clase = c.id_clase
    WHERE 
        ct.id_catedratico = ?
        AND dp.id_periodo = ?
    GROUP BY 
        ct.id_catedratico,
        ct.nombre_catedratico,
        c.id_clase,
        c.nombre_clase,
        c.creditos
    ORDER BY 
        ct.nombre_catedratico;
    `;

    try {
        const [rows] = await db.query(query, [id_catedratico, id_periodo]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos');
    }
}

module.exports = { filtro_docente };