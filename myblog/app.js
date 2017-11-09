var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var User = require('./models/User');
var index = require('./routes/index');
var api = require('./routes/api');
var admin = require('./routes/admin');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',swig.renderFile)
app.set('view engine', 'html');
swig.setDefaults({ cache: false });
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置cookies
app.use(function (req, res, next) {
  req.userInfo = {}
  if (req.cookies.userInfo){
    try {
      req.userInfo = req.cookies.userInfo;
      User.findOne({_id: req.userInfo.uid}).then(function (result) {
        req.userInfo.isAdmin = result.isAdmin
        next()
      })
    } catch (error) {
      next(err);
    }
  }else{
    next();
  }
})
app.use('/', index);
app.use('/api', api);
app.use('/admin', admin);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error',{msg:'找不到页面'});
});

module.exports = app;
