const mostrarCatedraticos = (res) => {
    const query = 'SELECT id_catedratico, nombre_catedratico FROM catedraticos';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener los catedraticos' });
        }
        res.json(results);
    });
};

module.exports = {
    mostrarCatedraticos
};