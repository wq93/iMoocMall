var express = require('express');
var router = express.Router();
var User = require('../models/users')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/test', function (req, res, next) {
  res.send('test');
});
// 定义登录路由
router.post('/login', (req, res, next) => {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd,
  }
  console.log(param)
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      if (doc) {
        // 写入cookie
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        // req.session.users = doc
        res.json({
          status: 0,
          msg: '登录成功',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
})
module.exports = router;
