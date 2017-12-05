// require 默认去node_modules
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  'userId': String,
  'userName': String,
  'userPwd': String,
  'orderList': Array,
  'cartList': [
    {
      'productId': String,
      'productName': String,
      'salePrice': String,
      'productImage': String,
      'checked': String,
      'productNum': String
    }
  ],
  'addressList': [
    {
      'addressId': String,
      'userName': String,
      'streetName': String,
      'postCode': Number,
      'tel': Number,
      'isDefault': Boolean
    }
  ]
})
// Good 会自动加s去找数据库的集合
module.exports = mongoose.model('User', userSchema)
