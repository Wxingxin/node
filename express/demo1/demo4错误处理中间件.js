const express = require("express");
const app = express();
const PORT = 8080;

app.get("/todos", (req, res, next) => {
  console.log("is todos and get");
  const error = new Error("这是模拟的错误");
  /**
   * next() 匹配下一个中间件
   * next('route') 匹配当前中间件堆栈中的下一个
   * next(err) 跳过所有剩余的无错误处理路由和中间件函数
   */
  next(error);
});

app.use((err, req, res, next) => {
  console.log("is error", err);
  res.status(500).json({
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`port is http://www.localhost:${PORT}`);
});
