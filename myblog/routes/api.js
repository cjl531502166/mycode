var express = require('express');
var router = express.Router();
var User = require('../models/User');
/* GET users listing. */
router.use(function (req,res,next) {
  next();
})
var responseData = {
  code:0,
  message:''
};
router.post('/login', function(req, res, next) {
  var username = req.body.username ||'',
      password = req.body.password ||'';
  User.findOne({
    username:username,
    password:password
  }).then(function (useInfo) {
    console.log(useInfo);
    if(!useInfo){
      responseData.code = 1;
      responseData.message = '用户名或者密码错误';
    }else{
      responseData.message = '登陆成功';
    }
    res.json(responseData)
  })
});

module.exports = router;
