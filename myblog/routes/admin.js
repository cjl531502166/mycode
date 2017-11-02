var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
    res.render('admin/admin_login', { title: '管理员登录' });
});

module.exports = router;