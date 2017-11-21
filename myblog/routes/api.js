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
    userInfo: ''
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
      responseData.userInfo = {
        'uid': userInfo._id,
        'username': userInfo.username
      };
    }
    res.json(responseData)
  })
});

//用户删除接口
router.post('/user/delete',function (req,res) {
  if (req.body.id == '' || req.body.id == 'undefined') {
    responseData.message = '参数错误';
    responseData.code = 1;
  } else {
    User.remove({ _id: req.body.id }).then(function (doc) {
      responseData.message = '删除成功';
      res.json(responseData);
    })
  }
})

//设置管理员
router.post('/user/set',function (req,res) {
  User.findByIdAndUpdate(req.body.id,{isAdmin:true},function () {
    responseData.message = '设置成功';
    res.json(responseData);
  })
})
//退出登录
router.post('/logout',function (req,res,next) {
  res.clearCookie('userInfo')
  res.end()
});

//添加分类
router.post('/category/add',function (req,res) {
  var category = req.body.category;
  Category.count().then(function (count) {
    if (count >= 8) {
      responseData.message = '最多添加' + count + '个分类';
      responseData.code = 1;
      res.json(responseData);
      return;
    }
    Category.findOne({ name: category }).then(function (cateList) {
      if (cateList) {
        responseData.code = 2;
        responseData.message = '已存在同名分类';
      } else {
        new Category({ name: category }).save().then(function (category) {
          responseData.message = '添加分类成功'
        });
      }
      res.json(responseData);
    })
  });
});
//删除分类接口
router.post('/category/delete',function (req,res) {
  if (req.body.id == ''|| req.body.id == 'undefined') {
    responseData.message = '参数错误';
    responseData.code = 1;
  }else{
    Category.remove({_id:req.body.id}).then(function (doc) {
      responseData.message = '删除成功';
      res.json(responseData);
    })
  }
})

//添加内容接口
router.post('/content/add',function (req,res) {
  if(req.body.content == ''){
    responseData.message = '文章内容不能为空';
    responseData.code = 1;
    res.json(responseData);
    return
  }
  Category.findOne({_id:req.body.category}).sort({_id:-1}).then(function (cate) {
    if(cate == null){
      responseData.code = 2;
      responseData.message = '分类已经被删除';
      res.json(responseData);
      return
    }
    new Content({
      title: req.body.title,
      category: req.body.category,
      description: req.body.descrip,
      content: req.body.content,
      user: req.cookies.userInfo.uid
    }).save().then(function (content) {
      if (content) {
        responseData.message = '内容添加成功'
      } else {
        responseData.code = 1;
        responseData.message = '内容添加失败';
      }
      res.json(responseData);
    })
  })
})

//删除内容接口
router.post('/content/delete', function (req, res) {
  if (req.body.id == '' || req.body.id == 'undefined') {
    responseData.message = '参数错误';
    responseData.code = 1;
  } else {
    Content.remove({ _id: req.body.id }).then(function (doc) {
      responseData.message = '删除成功';
      res.json(responseData);
    })
  }
})

//图片上传接口
module.exports = router;
