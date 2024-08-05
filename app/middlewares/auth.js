'use strict';

const services = require('../services/service');

function isAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'Not authorized' });
    }
    const token = req.headers.authorization.split(' ')[1];
    services.decodeToken(token)
        .then(decoded => {
            req.user = decoded;
            next();
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

module.exports = { isAuth };