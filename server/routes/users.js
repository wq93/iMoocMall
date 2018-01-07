var express = require('express');
var router = express.Router();
var User = require('../models/users')
require('../util/util')
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
  let checked = req.body.checked
  // console.log(userId,productId,productNum)
  // mongoose的api 修改子文档
  User.update({
    // 根据userId条件查找
    userId,
    'cartList.productId': productId
  }, {
    // $ 层级通配符
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked,
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
            productNum,
            checked
          }
        })
      }
    }
  });

})

// 全部选中当前用户的购物车商品的数量
router.post('/editCheckAll', (req, res, next) => {
  // 用户id
  let userId = req.cookies.userId
  let checkAll = req.body.checkAll ? '1' : '0'
  // 根据id查找用户
  User.findOne({userId}, (err, user) => {
    if (err) {
      res.json({
        status: 1,
        msg: error.message,
        result: ''
      })
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAll
        })
        user.save((err1, doc) => {
          console.log(doc)
          if (err1) {
            res.json({
              status: 1,
              msg: err1, message,
              result: ''
            });
          } else {
            res.json({
              status: 0,
              msg: '',
              result: {
                cartList: doc.cartList
              }
            });
          }
        })
      }
    }
  })
})

// 查询用户地址接口
router.get('/address', (req, res, next) => {
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
          result: doc.addressList
        })
      }
    }
  })
})
// 设置默认地址接口
router.post("/setDefault", (req, res, next) => {
  // 用户id
  let userId = req.cookies.userId
  let addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: 1003,
      msg: 'addressId is null',
      result: ''
    })
  } else {
    User.findOne({userId}, (err, doc) => {
      if (err) {
        res.json({
          status: 1,
          msg: error.message,
          result: ''
        })
      } else {
        User.findOne({userId: userId}, (err, doc) => {
          if (err) {
            res.json({
              status: 1,
              msg: err.message,
              result: ''
            });
          } else {
            let addressList = doc.addressList;
            addressList.forEach((item) => {
              if (item.addressId == addressId) {
                item.isDefault = true;
              } else {
                item.isDefault = false;
              }
            });

            doc.save((err1, doc1) => {
              if (err) {
                res.json({
                  status: 1,
                  msg: err.message,
                  result: ''
                });
              } else {
                res.json({
                  status: 0,
                  msg: '',
                  result: doc1.addressList
                });
              }
            })
          }
        });
      }
    })
  }
})

// 删除地址接口
router.post('/delAddress', (req, res, next) => {
  // 用户id
  let userId = req.cookies.userId
  let addressId = req.body.addressId;
  User.update({
    // 根据userId条件查找
    userId
  }, {
    $pull: {
      // cartList集合下的
      'addressList': {
        // 这个元素
        addressId
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
          result: doc.addressId
        })
      }
    }
  });
})
// 生成订单接口
router.post('/payMent', (req, res, next) => {
  // 用户id
  let userId = req.cookies.userId
  let orderTotal = req.body.orderTotal
  let addressId = req.body.addressId
  User.findOne({
    // 根据userId条件查找
    userId
  }, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: error.message,
        result: ''
      })
    } else {
      let address = ''
      let goodList = []
      let order = {}
      // 获取当前用户的地址信息
      doc.addressList.forEach((item) => {
        // 对比id
        if (item.addressId === addressId) {
          address = item
        }
      })
      // 获取用户购物车的购买商品
      doc.cartList.filter((item) => {
        if (item.checked === '1') {
          goodList.push(item)
        }
      })
      //****** 生成订单ID ******
      let platform = '622'
      let r1 = Math.floor(Math.random() * 10)
      let r2 = Math.floor(Math.random() * 10)
      let sysDate = new Date().Format('yyyyMMddhhmmss')
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
      let orderId = platform + userId + r1 + sysDate + r2; // 订单ID
      // 订单详情
      order = {
        // 0表示成功 1表示失败
        orderStatus: 0,
        orderTotal,
        goodList,
        addressInfo: address,
        orderId,
        createDate
      }
      // 向数据库保存订单详情
      doc.orderList.push(order)
      doc.save((err1, doc1) => {
        if (err1) {
          res.json({
            status: 1,
            msg: error.message,
            result: ''
          })
        } else {
          res.json({
            status: 0,
            msg: '',
            result: order
          });
        }
      })
    }
  });
})

module.exports = router;
