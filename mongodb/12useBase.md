明白，你想在 **Node.js + MongoDB** 项目中，提前定义一个 **数据模板**（也就是文档结构、类似 SQL 的表结构），方便在插入数据时遵循统一格式。

在 MongoDB 里，本身是 **Schema-less（无固定模式）** 的，但在 Node.js 项目中我们通常用 **Mongoose** 来定义数据模型（Schema），这样就可以创建模板。

---

### 1️⃣ 安装 Mongoose

```bash
npm install mongoose
```

---

### 2️⃣ 定义数据模板（Schema）

比如我们要为用户创建模板 `User`：

```js
// models/User.js
const mongoose = require("mongoose");

// 1. 连接 MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/testdb")
  .then(() => console.log("MongoDB connected with Mongoose"))
  .catch(err => console.error(err));

// 2. 定义 Schema（数据模板）
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },   // 姓名，必填
  age: { type: Number, required: true },    // 年龄，必填
  email: { type: String, required: true, unique: true }, // 邮箱，唯一
  createdAt: { type: Date, default: Date.now } // 创建时间，默认现在
});

// 3. 创建模型（Model）
const User = mongoose.model("User", userSchema);

module.exports = User;
```

---

### 3️⃣ 使用模板进行增删改查

```js
// app.js
const express = require("express");
const User = require("./models/User");

const app = express();
app.use(express.json());

// 添加用户
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body); // 按模板创建
    const result = await user.save();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

// 查询所有用户
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

// 更新用户
app.put("/users/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});

// 删除用户
app.delete("/users/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

---

### ✅ 总结

1. **Schema（模板）**：定义了文档的结构和字段类型，保证数据统一。
2. **Model（模型）**：基于 Schema 创建，用于增删改查。
3. **Mongoose**：帮助你在 Node.js 中用 Schema 模板管理 MongoDB 数据。

---

如果你需要，我可以帮你写一个 **完整的 Node + Express + Mongoose CRUD 示例**，里面包含 **用户、文章、评论三个模板**，像一个小型数据库项目模板，方便直接用。

你希望我直接写吗？
