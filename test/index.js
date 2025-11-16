const express = require("express");
const app = express();
const db = require("./db");

app.use(express.json());

// 查询用户
app.get("/users", async (req, res) => {
  const users = await db.find("users", { age: 22 });
  res.json(users);
});

// 添加用户
app.post("/users", async (req, res) => {
  const result = await db.insert("users", req.body);
  res.json(result);
});

// 更新用户
app.put("/users/:id", async (req, res) => {
  const result = await db.update("users", req.params.id, req.body);
  res.json(result);
});

// 删除用户
app.delete("/users/:id", async (req, res) => {
  const result = await db.remove("users", req.params.id);
  res.json(result);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
