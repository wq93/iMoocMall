var express = require('express');
var path = require('path'); // ️以当前文件夹作为路径
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs') // 引入ejs
var index = require('./routes/index');
var users = require('./routes/users');
// 添加路由
var goods = require('./routes/goods')
var app = express();

// view engine setup
// 设置路径
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express) // 设置html的后缀
// app.set('view engine', 'jade');
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置登录/登出拦截
app.use(function (req, res, next) {
  if (req.cookies.userId) {
    next();
  } else {
    console.log("url:" + req.originalUrl);
    // 设置路由白名单
    if (req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.originalUrl.indexOf('/goods/list') > -1) {
      next();
    } else {
      res.json({
        status: 10001,
        msg: '当前未登录',
        result: ''
      });
    }
  }
})

// 通过路由读取文件
app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
