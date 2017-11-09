var express = require('express');
var router = express.Router();
var User = require('../models/User');
var baseUrl;
router.use(function (req, res, next) {
    baseUrl = req.baseUrl;
    next();
})

router.get('/login',function (req,res) {
    if(req.cookies.userInfo){
       res.redirect(baseUrl+'/index')
       return;
    }
    res.render('admin/admin_login', { title: '管理员登录' });
})
router.get('/index',function (req,res) {
    if (!req.cookies.userInfo) {
        res.redirect(baseUrl + '/login')
        return;
    }
    res.render('admin/admin_index', { title: '博客管理后台', userInfo: req.userInfo});
})
router.get('/page',function (req,res) {
    var req_pid = req.query.pid;
    if (req_pid==='pageId_0'){
        User.find().then(function (users) {
            res.render('admin/admin_page', {
                title: '博客管理后台',
                userInfo: req.userInfo,
                users:users
            })
        });
    }
})
module.exports = router;