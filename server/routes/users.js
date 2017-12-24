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
// 定义登录接口
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
// 定义登出接口
router.post('/logout', (req, res, next) => {
  // 设置cookie
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.cookie("userName", "", {
    path: "/",
    maxAge: -1
  });
  res.json({
    status: 0,
    msg: '',
    result: ''
  })
})
// 登录校验
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: 0,
      msg: '',
      result: req.cookies.userName || ''
    })
  } else {
    res.json({
      status: 1,
      msg: '未登录',
      result: ''
    });
  }
})

// 查询当前用户的购物车数据
router.get('/cartList', (req, res, next) => {
  // 用户id
  let userId = req.cookies.userId
  User.findOne({userId}, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: error.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: 0,
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})
// 删除当前用户的购物车单条数据
router.post('/cartDel', (req, res, next) => {
  // 用户id
  let userId = req.cookies.userId
  let productId = req.body.productId
  // mongoose的api
  User.update({
    // 根据userId条件查找
    userId
  }, {
    $pull: {
      // cartList集合下的
      'cartList': {
        // 这个元素
        productId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: error.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: 0,
          msg: '删除成功',
          result: 'suc'
        })
      }
    }
  });

})

// 修改当前用户的购物车商品的数量
router.post('/cartEdit', (req, res, next) => {
  // 用户id
  let userId = req.cookies.userId
  let productId = req.body.productId
  let productNum = req.body.productNum
  // console.log(userId,productId,productNum)
  // mongoose的api 修改子文档
  User.update({
    // 根据userId条件查找
    userId,
    'cartList.productId': productId
  }, {
    // $ 层级通配符
    'cartList.$.productNum': productNum
  }, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: error.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: 0,
          msg: '更新成功',
          result: {
            productId,
            productNum
          }
        })
      }
    }
  });

})
module.exports = router;
