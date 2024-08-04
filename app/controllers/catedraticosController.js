const db = require('../config/db');

const mostrarCatedraticos = async (req, res) => {
    const query = 'SELECT id_catedratico, nombre_catedratico FROM catedraticos';
    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los catedraticos' });
    }
};

module.exports = {
    mostrarCatedraticos
};