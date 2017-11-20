var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    //用户名
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    addTime: {
        type: Date,
        default: new Date()
    },
    //评论
    comments: {
        type: Array,
        default: []
    },
    view: {
        type: Number,
        default: 0
    },
    //标题
    title: String,
    //描述
    description: {
        type: String,
        default: ''
    },
    //内容
    content: {
        type: String,
        default: ''
    }
})