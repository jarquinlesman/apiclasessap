const db = require('../config/db');

const mostrarPeriodos = async (req, res) => {
    const query = 'SELECT id_periodo FROM periodos';
    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el periodo' });
    }
};

module.exports = {
    mostrarPeriodos
};
