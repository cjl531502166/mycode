var mongoose = require("mongoose");
module.exports = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    "nickname":{
        type:String,
        default:''
    },
    "avatar":String,
    "workTitle": String,
    "location":String,
    "gitAddr":String
})