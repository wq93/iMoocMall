// require 默认去node_modules
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var produtSchema = new Schema({
  "productId": String,
  "productName": String,
  "salePrice": Number,
  "productImage": String
})
// Good 会自动加s去找数据库的集合
module.exports = mongoose.model('Good', produtSchema)
