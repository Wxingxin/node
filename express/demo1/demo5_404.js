const express = require("express");

const app = express();

app.get("/todos", (req, res) => {
  res.send("is find todos");
});

//404 的情况
app.use((req, res, next) => {
  res.status(404).send("404 Not Fonund");
});

app.listen(8080, () => {
  console.log("is running");
});
