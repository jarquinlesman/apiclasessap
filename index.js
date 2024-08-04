'use strict'

const db = require('./app/config/db');
const CONFIG = require('./app/config/config');
const App = require('./app/app');

// db.SequelizeInstance.sync().then(() => {
//     console.log("Synced");
// })

App.listen(CONFIG.PORT, function (error) {
    if (error) return console.error(error);
    console.log(`server running on port: ${CONFIG.PORT}`);
});