const express =require('express');
const router = express.Router();

//用户相关了路由
router.use(require("./user"));

//用户资源相关路由
router.use('./profile',require('./profile'))

//文章相关路由
router.use('/articles', require('./article'))

//标签相关路由
router.use('/tags', require('./tag.js'))

module.exports = router;
