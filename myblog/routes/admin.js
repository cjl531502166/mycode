var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
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
    res.render('admin/admin_index', { title: '博客管理后台', userInfo: req.userInfo });
})
router.get('/page',function (req,res) {
    var req_pid = req.query.pid;
    if(!req.cookies.userInfo){
        res.redirect(baseUrl + '/login');
        return;
    }
    switch (req_pid) {
        case 'pageId_0':
            User.find().then(function (users) {
                res.render('admin/user_index', {
                    pid: req_pid,
                    title: '博客管理后台',
                    userInfo: req.userInfo,
                    users: users
                })
            });
            break;
        case 'pageId_1':
            //查询分类
            Category.find().sort({_id: -1}).then(function (category) {
                res.render('admin/category_list',{
                    pid:req_pid,
                    title:'博客管理后台',
                    userInfo:req.userInfo,
                    categories: category
                })
            })
            break;
        case 'pageId_2':
            //添加分类
            res.render('admin/add_layout',{
                pid:req_pid,
                title: '博客管理后台',
                column_headers:'添加分类',
                userInfo: req.userInfo
            });
            break;
        case 'pageId_3':
            //查询内容
            Content.find().sort({_id:-1}).populate(['category','user']).then(function (content) {
                console.log(content);
                res.render('admin/content_list',{
                    pid:req_pid,
                    title:'博客管理后台',
                    userInfo:req.userInfo,
                    contents: content
                })
            })
            break;
        case 'pageId_4':
            //添加内容
            Category.find().then(function (categories) {
                res.render('admin/add_layout', {
                    pid: req_pid,
                    title: '博客管理后台',
                    column_headers: '添加内容',
                    userInfo: req.userInfo,
                    categories: categories,
                    description: req.body.descp
                });
            })
            break;
        default:
            res.render('error');
            break;
    }
})
module.exports = router;