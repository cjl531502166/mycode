var mongoose = require('mongoose');
var userShechma = require('../schemas/users')
module.exports = mongoose.model('User', userShechma);