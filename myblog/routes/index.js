var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
var responseData, currId;
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: '',
    userInfo: ''
  }
  next();
})

//首页
router.get('/', function (req, res) {
  var userInfo = req.userInfo;
  if (req.query.cid) currId = req.query.cid;
  Promise.all([
    Category.find().sort({_id:-1}),
    Content.find({user: userInfo.uid}).populate([
      {
        path: 'category'
      }, {
        path: 'user', select: 'username'
      }
    ])
  ]).then(function (result) {
    var [categories, contents] = result;
    if (result) {
      res.render('main/index', {
        title: '我的个人博客首页',
        categories: categories,
        contents: contents,
        curr: currId,
        user: userInfo
      });
    }
  })
});

//文章详情页
router.get('/detail', function (req, res) { 
  var userInfo = req.cookies.userInfo.username;
  Promise.all([
    Category.find(),
    Content.findById(req.query.ctn_id).populate([
      {
        path: 'category'
      },
      {
        path: 'user',
        select: 'username'
      }
    ])
  ]).sort({addTime:-1}).then(function (result) {
    var [categories, content] = result;
    content.view ++;
    content.save();
    res.render('main/article_detail', {
      title: content.title,
      categories:categories,
      content: content,
      user: userInfo
    })
  })
})

//分类导航

module.exports = router;