下面我会用 **最简单、小白能看懂的方式**，手把手教你：

# ✅ Node.js 和 MongoDB 的链接 + 基本使用（小白版）

我们用 **MongoDB 官方推荐的 Mongoose** 来操作数据库，因为更简单、更安全、更好写。

---

# 1️⃣ 安装 MongoDB

你有两种方式：

### **方式 A：本地安装 MongoDB（最推荐）**

去官网下载安装即可：

```
https://www.mongodb.com/try/download/community
```

安装后 MongoDB 会自动启动数据库服务。

### **方式 B：使用 MongoDB Atlas（云数据库）**

注册即可免费使用。

---

# 2️⃣ Node.js 项目安装依赖

在你的项目文件夹里运行：

```bash
npm init -y
npm install mongoose
```

---

# 3️⃣ 使用 Mongoose 连接 MongoDB

创建 `db.js`：

```js
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mydb')
  .then(() => {
    console.log("MongoDB 连接成功");
  })
  .catch(err => {
    console.log("MongoDB 连接失败", err);
  });
```

> `mydb` 是你的数据库名，不需要提前创建，第一次使用会自动生成。

---

# 4️⃣ 创建一个模型（等同于定义一张表）

创建 `models/User.js`：

```js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  age: Number,
  password: String,
});

// "users" 这个集合名会自动变成复数（user ➜ users）
module.exports = mongoose.model("User", UserSchema);
```

这就相当于告诉 MongoDB：

> 我要一张叫 **users** 的表，里面有 username、age、password 这几个字段。

---

# 5️⃣ 在 Node.js 中进行 CRUD（增删改查）

创建 `index.js`：

```js
require('./db');   // 引入数据库连接
const User = require('./models/User');

// 1. 新增数据
async function createUser() {
  const u = await User.create({
    username: "Tom",
    age: 20,
    password: "123456"
  });

  console.log("新增成功:", u);
}

// 2. 查询数据
async function findUser() {
  const users = await User.find({ age: { $gte: 18 } });
  console.log("查询结果:", users);
}

// 3. 修改数据
async function updateUser() {
  const res = await User.updateOne(
    { username: "Tom" },
    { age: 25 }
  );
  console.log("修改结果:", res);
}

// 4. 删除数据
async function deleteUser() {
  const res = await User.deleteOne({ username: "Tom" });
  console.log("删除结果:", res);
}

createUser();
// findUser();
// updateUser();
// deleteUser();

```

只需要把想执行的函数取消注释即可。

---

# 6️⃣ 运行项目

```bash
node index.js
```

看到：

```
MongoDB 连接成功
新增成功: { ... }
```

表示完美运行。

---

# 7️⃣ CRUD 总结（超级简单版）

| 操作   | 用法                 |
| ---- | ------------------ |
| 新增   | `User.create()`    |
| 查询全部 | `User.find()`      |
| 查询一个 | `User.findOne()`   |
| 修改一个 | `User.updateOne()` |
| 删除一个 | `User.deleteOne()` |

---

# 8️⃣ 为什么推荐 Mongoose？

因为你是小白：

* 不需要写复杂的 MongoDB 原生语法
* 自动创建数据库和集合
* 自动转化数据类型
* 出错提示友好
* 更符合 Node.js 程序员使用习惯

---

# 如果你愿意，我可以给你做一个：

✅ Node + Express + MongoDB 的完整实战项目
例如：用户登录注册 / todo 列表 / 后端 API

你想学习哪种？我可以一步一步带你写。
