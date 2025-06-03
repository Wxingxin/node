const express = require("express");

//1 创建路由实例
//路由实例其实相当于一个mini Express 实例
const router = express.Router();

//2 配置路由
router.get("/", (req, res) => {
  console.log("this is router get");
  res.send("get");
});

router.get('/todos',(req, res) => {
  res.send({
    "ok": "is success"
  })
}
)
//3 导出路由实例
module.exports = router

//4 将路由集成到 Express 实例应用中 分为2步
/**
 * 第一步：在相应的文件中引用 : const router = require('./router')
 * 第二部：挂载到路由上 : app.use(router)
*/
