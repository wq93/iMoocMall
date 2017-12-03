var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // 读取index.html文件
  res.render('index', { title: 'Express,hahaha' });
});

module.exports = router;
