const mongoose = require('mongoose')
const dbConnection = require('../lib/dbConnection')

let Schema = mongoose.Schema;
let schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = dbConnection.model('User', schema);