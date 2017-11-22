var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var responseData,currId;
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: '',
    userInfo: ''
  }
  if(req.query.id) currId = req.query.id;
  next();
})
router.get('/',function(req, res) {
  Category.find().then(function (category) {
    if(category){
      res.render('main/index', {
        title:'我的个人博客首页',
        categories:category,
        curr: currId
      });
    }
  })
});

module.exports = router;