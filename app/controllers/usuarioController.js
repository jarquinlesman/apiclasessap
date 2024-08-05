'use strict';

const bcrypt = require('bcrypt');
const service = require('../services/service');

const users = [
  { userId: 'admin1', pass: bcrypt.hashSync('unicah2024', 10) },
  { userId: 'admin2', pass: bcrypt.hashSync('waton', 10) },
];

async function signIn(req, res) {
    const userId = req.body['userId'];
    console.log(userId);

    const user = users.find(u => u.userId === userId);
    
    if (!user) {
        res.status(404).send({ message: 'Usuario no encontrado' });
    } else {
        const result = bcrypt.compareSync(req.body['pass'], user.pass);
        
        if (result) {
            res.status(200).send({
                message: 'Logged in',
                userId: user.userId,
                token: service.createToken(user.userId)
            });
        } else {
            res.status(401).send({
                message: 'Contraseña incorrecta',
            });
        }
    }
}

module.exports = {
  signIn
};