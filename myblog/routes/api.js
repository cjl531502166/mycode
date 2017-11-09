var express = require('express');
var router = express.Router();
var User = require('../models/User');
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
        res.cookie('userInfo', {
          'uid': userInfo._id,
          'username': userInfo.username
        }, { maxAge: 1000 * 60 * 60})
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
})


router.get('/user',function (req,res,next) {
  var req_param = req.body.pageId;
  console.log(req_param); 
  res.json(responseData)
})
module.exports = router;
