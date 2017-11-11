var mongoose = require('mongoose');
var categoryShechma = require('../schemas/categories');
module.exports = mongoose.model('Category', categoryShechma);