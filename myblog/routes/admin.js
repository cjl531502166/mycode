var express = require('express');
var router = express.Router();

router.get('/',function (req, res, next) {
    if(req.userInfo.keepLogin){
        res.render('admin/admin_index', { title: '博客管理后台' });
    }else{
        res.render('admin/admin_login', { title: '管理员登录' });
    }
});

module.exports = router;