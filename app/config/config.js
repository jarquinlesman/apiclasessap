'use strict'

module.exports = {
    PORT: process.env.PORT || 3300,
    HOST: process.env.DB || '127.0.0.1',
    DB: 'Clases',
    USER: 'root',
    PASSWORD: '',
    DIALECT: 'mysql',
    POOL_MAX: 5,
    POOL_MIN: 0,
    POOL_ACQUIRE: 30000,
    POOL_IDLE: 10000
    
    // API_TOKEN: '',
    // SECRET_TOKEN: '',
    // PRIVATE_KEY: '',
    // CLIENT_EMAIL: '',

    //Comandos
    //CTRL + K + U PARA COMENTAR VARIAS LÍNEAS Y CTRL + K + U PARA DESCOMENTAR
}