const express = require("express");
const app = express();

const PORT = 8080;

//中间件，调用内置的json函数
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url, Date.now());
  //中间件中添加  后面的都可以访问到
  req.foo = "bar";
  next();
});

app.get("/", (req, res) => {
  console.log(req.foo);
  res.send("hello world");
});

app.get(
  "/user/:id",
  (req, res, next) => {
    if (req.params.id === "0") next("route");
    else next();
  },
  (req, res, next) => {
    res.send("regular");
  }
);
app.get("/user/:id", (req, res, next) => {
  res.send("special");
});

//
const logUrl = (req, res, next) => {
  console.log(`Request Url: ${req.url}`);
  next();
};
const logMethdo = (req, res, next) => {
  console.log(`Request Type:${req.method}`);
  next();
};
const logStuff = [logUrl, logMethdo];
app.get("/user/:id", logStuff, (req, res, next) => {
  res.send("User Info");
});

app.listen(PORT, () => {
  console.log(`port is http://www.localhost:${PORT}`);
});
