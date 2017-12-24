var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
// 取数据库模型
var Goods = require('../models/goods')
var User = require('../models/users')

// 连接mongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall')

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected sucess")
})

mongoose.connection.on("error", function () {
  console.log("MongoDB connected error")
})

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected")
})
// 查询商品列表数据
router.get("/list", function (req, res, next) {
  // res.send('hello,good list')
  // 获取参数
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let priceLevel = req.param("priceLevel")

  let sort = req.param('sort')
  let skip = (page - 1) * pageSize // 跳过几条
  let params = {}
  var priceGt = ''
  var priceLte = ''
  // 格式化区间
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize) // 跳过几条,取几条
  goodsModel.sort({'salePrice': sort}) // 排序
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})
// 加入购物车
router.post("/addCart", function (req, res, next) {
  let userId = '100000077'
  let productId = req.body.productId
  // let productId = '201710003'
  User.findOne({userId: userId}, function (err, userDoc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (userDoc) {
        var goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          // 如果商品存在数组中
          if (item.productId == productId) {
            console.log(item)
            goodsItem = item;
            item.productNum++;
          }
        });
        // 如果商品存在数组中(数量累加保存)
        if (goodsItem) {
          userDoc.save(function (err3, doc2) {
            if (err3) {
              res.json({
                status: 1,
                msg: err2.message
              })
            } else {
              res.json({
                status: 0,
                msg: '',
                result: 'suc'
              })
            }
          })
        } else {
          // 如果商品不存在数组中(按id找到,添加到cartList数组中)
          Goods.findOne({productId: productId}, function (err1, doc) {
            if (err1) {
              res.json({
                status: 1,
                msg: err1.message
              })
            } else {

              if (doc) {
                doc.productNum = 1;
                // 默认选中
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2, doc2) {
                  if (err2) {
                    res.json({
                      status: 1,
                      msg: err2.message
                    })
                  } else {
                    res.json({
                      status: 0,
                      msg: '',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          });
        }
      }
    }
  })
})

// 输出router
module.exports = router
