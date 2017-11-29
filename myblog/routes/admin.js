var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
var baseUrl
    ,user = {}//查询条件;
router.use(function (req, res, next) {
    baseUrl = req.baseUrl;
    if (!req.userInfo.isAdmin) {
        user.user = req.userInfo.uid;
    }
    next();
})
//登录
router.get('/login',function (req,res) {
    if(req.cookies.userInfo){
       res.redirect(baseUrl+'/index')
       return;
    }
    res.render('admin/admin_login', { title: '登录' });
})
router.get('/register',function (req,res) {
    res.render('admin/register',{title:'用户注册'});
})
//注册

//管理首页
router.get('/index',function (req,res) {
    if (!req.cookies.userInfo) {
        res.redirect(baseUrl + '/login')
        return;
    }
    
    Promise.all([
        User.find().limit(3),
        Category.find().limit(3),
        Content.find(user).populate(['category', 'user']).limit(3)
    ]).then(function (result) {
        var [users,categories,contents] = result;
        res.render('admin/admin_index', { 
            title: '博客管理后台',
            userInfo: req.userInfo,
            users: users,
            categories:categories,
            contents:contents
        });
    })    
})
//侧栏导航
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
            Content.find(user).sort({_id:-1}).populate(['category','user']).then(function (content) {
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

// 分类修改
router.get('/editcate',function (req,res) {
    var cate_id = req.query.id;
    Category.findById(cate_id).then(function (category) {
        res.render('admin/category_edit', {
            title: '博客管理后台',
            userInfo: req.userInfo,
            category: category
        })
    })
})

//内容修改
router.get('/editcontent',function (req,res) {
    var cate_id = req.query.id,categories = [];
    Category.find().then((category) =>{
        categories = category;
        return Content.findById(cate_id).populate('category').then((content)=>{
            if(!content){
                res.render('error',{msg:'内容已经不存在'})
                return Promise.reject();
            }else{
                res.render('admin/content_edit', {
                    title: '博客管理后台',
                    userInfo: req.userInfo,
                    content: content,
                    categories:categories
                })
            }
        })
    })
})
module.exports = router;