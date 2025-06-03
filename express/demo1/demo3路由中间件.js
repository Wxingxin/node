const express = require("express");
const app = express();
const PORT = 8080;

const router = require("./router");

app.get("/", (req, res) => {
  res.send("is get and /");
});

//普通挂载
app.use(router);

//给路由限定访问前缀
app.use("/abc", router);

app.listen(PORT, () => {
  console.log(`port is http://www.localhost:${PORT}`);
});
