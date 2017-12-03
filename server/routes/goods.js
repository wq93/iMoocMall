var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')

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

router.get("/", function (req, res, next) {
  // res.send('hello,good list')
  // 获取参数
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let sort = req.param('sort')
  let skip = (page - 1) * pageSize // 跳过几条
  let params = {}
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

// 输出router
module.exports = router
