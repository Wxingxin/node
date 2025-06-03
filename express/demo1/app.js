const express = require("express");

const app = express();

//get
app.get("/", (req, res) => {
  console.log(`请求参数 : ${req.query.foo}`)
  console.log(`${req.params.id}`)
  res.send("hello world");
});

app.get("/users", (req, res) => {
  //打印日志
  console.log(req.url);
  console.log(req.method);
  console.log(req.headers);
  res.send("users");
});

//post
app.post("/", (req, res) => {
  res.send("post and /");
});

//put
app.put("/", (req, res) => {
  res.send("put and /");
});

//delete
app.delete("/", (req, res) => {
  res.send("delete / 🚀");
});

//设置启动服务的端口号
app.listen(8080, () => {
  //打印服务日志
  console.log(`8080 port at http://localhost:8080`);
});
