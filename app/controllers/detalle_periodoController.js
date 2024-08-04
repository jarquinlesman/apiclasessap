const db = require('../config/db.js');

const insertarDetallePeriodo = async (req, res) => {
  const { id_catedratico, id_clase, hora_inicio } = req.body;

  try {
    // Primero debemos obtener el último periodo que se ha insertado
    const [ultimoPeriodo] = await db.query(`
      SELECT id_periodo 
      FROM periodos 
      ORDER BY fecha_final DESC 
      LIMIT 1;
    `);
    
    //Validación para verificar que si hayan períodos registrados
    if (ultimoPeriodo.length === 0) {
      return res.status(400).json({ error: 'No se ha registrado ningún periodo.' });
    }

    //Obtengo el id del último periodo registrado, y que obtuve en la consulta anterior
    const ultimoPeriodoId = ultimoPeriodo[0].id_periodo;

    // Verificar si el catedrático ya tiene una clase a la misma hora en el último período encontrado, para que no choque ninguna clase
    const [claseCatedratico] = await db.query(`
      SELECT COUNT(*) AS count 
      FROM detalle_periodo 
      WHERE id_catedratico = ? 
        AND hora_inicio = ? 
        AND id_periodo = ?;
    `, [id_catedratico, hora_inicio, ultimoPeriodoId]);
    
    //ahora voy a validar si mi consulta encontró resultado, si el count es mayor a 0, significa que ya tiene clase asignada a esa hora
    if (claseCatedratico[0].count > 0) {
      return res.status(400).json({ error: 'El catedrático ya tiene una clase asignada en la hora indicada.' });
    }

    // Obtener todas las carreras que llevan la clase especificada
    const [carrerasBloques] = await db.query(`
      SELECT icc.id_carrera, icc.id_bloque,  c.nombre_carrera
      FROM carrera_clase_bloque icc
      JOIN carreras c on icc.id_carrera = c.id_carrera
      WHERE id_clase = ?;
    `, [id_clase]);

    // Realizar todas las validaciones primero
    for (let i = 0; i < carrerasBloques.length; i++) {
      const { id_carrera, id_bloque, nombre_carrera } = carrerasBloques[i];

      // Validar que ninguna clase diferente de la misma carrera y bloque esté en la misma hora
      const [bloqueConflicto] = await db.query(`
        SELECT dp.* 
        FROM detalle_periodo dp
        JOIN carrera_clase_bloque ccb ON dp.id_ccb = ccb.id_ccb
        WHERE ccb.id_bloque = ?
          AND dp.hora_inicio = ? 
          AND dp.id_periodo = ?
          AND ccb.id_clase != ?;
      `, [id_bloque, hora_inicio, ultimoPeriodoId, id_clase]);

      if (bloqueConflicto.length > 0) {
        return res.status(400).json({ error: `Otra clase del mismo bloque ya ha sido asignada en ese horario para la carrera ${nombre_carrera}.` });
      }
    }

    // Si todas las validaciones pasan, proceder con las inserciones
    for (let i = 0; i < carrerasBloques.length; i++) {
      const { id_carrera, id_bloque } = carrerasBloques[i];

      // Generar la sección
      let seccion;
      // Primero consulto si hay sección para esa clase, en esa misma hora en el periodo actual
      const [seccionExistente] = await db.query(`
        SELECT seccion 
        FROM detalle_periodo
        WHERE id_ccb = (
          SELECT id_ccb 
          FROM carrera_clase_bloque 
          WHERE id_clase = ? AND id_carrera = ?
        ) 
          AND id_periodo = ?
          AND hora_inicio = ?
        ORDER BY seccion DESC LIMIT 1;
      `, [id_clase, id_carrera, ultimoPeriodoId, hora_inicio]);

      // Hago las validación de la consulta anterior
      if (seccionExistente.length === 0) {
        // Si no hay secciones, genero la primera sección, tomando en cuenta los dos primeros número de la hora
        seccion = hora_inicio.slice(0, 2) + '01';
      } else {
        // Si hay secciones, añado la siguiente sección.
        const ultimaSeccion = parseInt(seccionExistente[0].seccion.slice(2), 10);
        seccion = hora_inicio.slice(0, 2) + (ultimaSeccion + 1).toString().padStart(2, '0');
      }

      // Insertar el registro en detalle_periodo
      await db.query(`
        INSERT INTO detalle_periodo (seccion, id_catedratico, id_ccb, id_periodo, hora_inicio)
        VALUES (?, ?, (
          SELECT id_ccb 
          FROM carrera_clase_bloque 
          WHERE id_clase = ? AND id_carrera = ?
        ), ?, ?);
      `, [seccion, id_catedratico, id_clase, id_carrera, ultimoPeriodoId, hora_inicio]);
    }

    res.status(201).json({ message: 'Clase registrada exitosamente para todas las carreras.' });
  
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar la clase.');
  }
};

module.exports = { insertarDetallePeriodo };