var mongoose = require('mongoose');
var userInfoShechma = require('../schemas/userinfo')
module.exports = mongoose.model('userInfo', userInfoShechma);