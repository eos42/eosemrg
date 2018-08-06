const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
let config = require('../package.json').config;
module.exports = mongoose.createConnection(config.dbUrl);