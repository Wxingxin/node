const express = require("express");
const app = express();

const fs = require("fs");

app.get("/", (req, res) => {
  fs.readFile("./page/index.html", "utf8", (err, data) => {
    if (!err) {
      res.end(data);
    } else {
      console.log(err);
    }
  });
});

app.get("/login", (req, res) => {
  fs.readFile("./page/login.html", "utf-8", (err, data) => {
    if (!err) {
      res.end(data);
    } else {
      console.log(err);
    }
  });
});

app.listen(8080, () => {
  console.log(`port at : http://localhost:8080`);
});
