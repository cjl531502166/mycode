var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
var responseData;
router.use(function (req,res,next) {
  responseData = {
    code: 0,
    message: '',
    useInfo: ''
  }
  next();
})
//登陆后台
router.post('/login', function(req, res, next) {
  var username = req.body.username ||'',password = req.body.password ||'',keeplogin = req.body.keeplogin=='on'?true:false;
  var reg = new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]", "i");
  if(reg.test(username) == true || reg.test(password) == true){
    responseData.code = 1;
    responseData.message = "用户名或密码含有非法字符";
    return res.json(responseData);
  }
  User.findOne({
    username: username,
    password: password
  }).then(function (userInfo) {
    if (!userInfo) {
      responseData.code = 2;
      responseData.message = '用户名或者密码错误';
    } else{
      if(keeplogin){
        res.cookie('userInfo', 
        {
          'uid': userInfo._id,
          'username': userInfo.username
        },
        {"maxAge": 1000 * 60 * 600})
      }else{
        res.cookie('userInfo', {
          'uid': userInfo._id,
          'username': userInfo.username
        })
      }
      responseData.message = '登陆成功';
      responseData.useInfo = {
        'uid': userInfo._id,
        'username': userInfo.username
      };
    }
    res.json(responseData)
  })
});
//退出登录
router.post('/logout',function (req,res,next) {
  res.clearCookie('userInfo')
  res.end()
});

//添加分类
router.get('/category/add',function (req,res) {
  var category = req.query.category;
  Category.findOne({name:category}).then(function (cateList) {
    if(cateList){
      responseData.code = 1;
      responseData.message = '已存在同名分类';
    }else{
      new Category({name:category}).save().then(function (category) {
        responseData.message = '添加分类成功'
      });
    }
    res.json(responseData);
  })
});
//添加内容接口
router.post('/content/add',function (req,res) {
  if(req.body.content == ''){
    responseData.message = '文章内容不能为空';
    responseData.code = 1;
    res.json(responseData);
    return
  }
  new Content({
    title:req.body.title,
    category:req.body.category,
    description:req.body.descrip,
    content:req.body.content,
    user:req.useInfo._id.toString()
  }).save().then(function (content) {
    if(content){
      responseData.message = '内容添加成功'
    }else{
      responseData.code = 1;
      responseData.message = '内容添加失败';
    }
  })
  res.json(responseData);
})
//图片上传接口
module.exports = router;
