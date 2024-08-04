const db = require('../config/db.js');

const actualizarDetallePeriodo = async (req, res) => {
    const { seccion, id_catedratico, id_clase, hora_inicio } = req.body;

    // Verifica qué parámetros están presentes y cuáles faltan
    const missingParams = [];
    if (!seccion) missingParams.push('seccion');
    if (!id_catedratico) missingParams.push('id_catedratico');
    if (!hora_inicio) missingParams.push('hora_inicio');
    if (!id_clase) missingParams.push('id_clase');

    if (missingParams.length > 0) {
        console.error('Parámetros faltantes:', missingParams.join(', '));
        return res.status(400).json({ error: 'Parámetros faltantes', missingParams });
    }

    try {
        // Verificar el último período registrado
        const [ultimoPeriodo] = await db.query(`
            SELECT id_periodo 
            FROM periodos 
            ORDER BY fecha_final DESC 
            LIMIT 1;
        `);

        if (ultimoPeriodo.length === 0) {
            return res.status(400).json({ error: 'No se ha registrado ningún periodo.' });
        }

        const ultimoPeriodoId = ultimoPeriodo[0].id_periodo;

        // Consultar los id_detalle que coincidan con la clase, la sección y el período actual
        const [detalles] = await db.query(`
            SELECT dp.id_detalle, dp.id_periodo, dp.id_ccb, dp.hora_inicio, dp.id_catedratico
            FROM detalle_periodo dp
            JOIN carrera_clase_bloque ccb ON dp.id_ccb = ccb.id_ccb
            WHERE ccb.id_clase = ? AND dp.seccion = ? AND dp.id_periodo = ?;
        `, [id_clase, seccion, ultimoPeriodoId]);

        // Verificar si se encontraron registros
        if (detalles.length === 0) {
            return res.status(404).json({ error: 'No se encontraron detalles con la clase, sección y período especificados.' });
        }

        // Recolectar detalles para verificar conflictos
        let actualizaciones = [];

        for (const detalle of detalles) {
            const { id_detalle, id_ccb, hora_inicio: horaInicioActual, id_catedratico: idCatedraticoActual } = detalle;

            // Obtener todas las carreras que llevan la clase especificada
            const [carrerasBloques] = await db.query(`
                SELECT icc.id_carrera, icc.id_bloque, c.nombre_carrera
                FROM carrera_clase_bloque icc
                JOIN carreras c ON icc.id_carrera = c.id_carrera
                WHERE icc.id_ccb = ?;
            `, [id_ccb]);

            // Validaciones antes de actualizar
            for (let i = 0; i < carrerasBloques.length; i++) {
                const { id_carrera, id_bloque, nombre_carrera } = carrerasBloques[i];

                // Verificar si hay conflicto de horarios en el mismo bloque
                const [bloqueConflicto] = await db.query(`
                    SELECT dp.* 
                    FROM detalle_periodo dp
                    JOIN carrera_clase_bloque ccb ON dp.id_ccb = ccb.id_ccb
                    WHERE ccb.id_bloque = ?
                    AND dp.hora_inicio = ? 
                    AND ccb.id_clase != ?
                    AND dp.id_periodo = ?;
                `, [id_bloque, hora_inicio, id_clase, ultimoPeriodoId]);

                if (bloqueConflicto.length > 0) {
                    return res.status(400).json({ error: `Otra clase del mismo bloque ya ha sido asignada en ese horario en otra carrera.` });
                }

                // Verificar si el catedrático ya tiene una clase a la misma hora
                const [claseCatedratico] = await db.query(`
                    SELECT COUNT(*) AS count 
                    FROM detalle_periodo 
                    WHERE id_catedratico = ? 
                    AND hora_inicio = ?
                    AND id_periodo = ?;
                `, [id_catedratico, hora_inicio, ultimoPeriodoId]);

                if (claseCatedratico[0].count > 0) {
                    return res.status(400).json({ error: 'El catedrático ya tiene una clase asignada en la hora indicada.' });
                }
            }

            // Determinar si se debe generar una nueva sección o no
            let nuevaSeccion = seccion;
            if (hora_inicio !== horaInicioActual) {
                // Generar nueva sección si la hora ha cambiado
                let [seccionExistente] = await db.query(`
                    SELECT seccion 
                    FROM detalle_periodo
                    WHERE id_ccb = ? 
                    AND id_periodo = ?
                    AND hora_inicio = ?
                    ORDER BY seccion DESC LIMIT 1;
                `, [id_ccb, ultimoPeriodoId, hora_inicio]);

                if (seccionExistente.length === 0) {
                    // Generar la primera sección si no existen secciones
                    nuevaSeccion = hora_inicio.slice(0, 2) + '01';
                } else {
                    // Generar la siguiente sección
                    const ultimaSeccion = parseInt(seccionExistente[0].seccion.slice(2), 10);
                    nuevaSeccion = hora_inicio.slice(0, 2) + (ultimaSeccion + 1).toString().padStart(2, '0');
                }
            }

            // Agregar la actualización a la lista
            actualizaciones.push({ id_detalle, hora_inicio, id_catedratico, seccion: nuevaSeccion });
        }

        // Realizar todas las actualizaciones de una vez para evitar conflictos
        for (const actualizacion of actualizaciones) {
            const { id_detalle, hora_inicio, id_catedratico, seccion } = actualizacion;

            await db.query(`
                UPDATE detalle_periodo 
                SET hora_inicio = ?, id_catedratico = ?, seccion = ?
                WHERE id_detalle = ?;
            `, [hora_inicio, id_catedratico, seccion, id_detalle]);
        }

        res.status(200).json({ message: 'Detalles de la clase actualizados exitosamente.' });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar los detalles de la clase.');
    }
};

module.exports = { actualizarDetallePeriodo };