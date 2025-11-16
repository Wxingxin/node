明白，我给你写一份 **Node.js + MongoDB 的完整示例代码大全**，从连接数据库、增删改查到测试查询，全都集成在一个文件里，适合初学者直接运行和测试。代码会详细注释每一步。

---

### **完整示例：`app.js`**

```js
// app.js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json()); // 解析 JSON 请求体

// ----------------------------
// 1️⃣ MongoDB 配置
// ----------------------------
const url = "mongodb://127.0.0.1:27017"; // 本地 MongoDB
const dbName = "testdb"; // 数据库名
let db = null; // 保存数据库实例

// ----------------------------
// 2️⃣ 连接 MongoDB
// ----------------------------
async function connectDB() {
  if (db) return db; // 如果已经连接过，直接返回
  const client = new MongoClient(url); // 新版 driver 不需要 useUnifiedTopology
  await client.connect();
  console.log("MongoDB connected successfully!");
  db = client.db(dbName);
  return db;
}

// ----------------------------
// 3️⃣ CRUD 封装函数
// ----------------------------

// 查询
async function find(collectionName, query = {}) {
  const db = await connectDB();
  return db.collection(collectionName).find(query).toArray();
}

// 插入
async function insert(collectionName, data) {
  const db = await connectDB();
  return db.collection(collectionName).insertOne(data);
}

// 更新
async function update(collectionName, id, data) {
  const db = await connectDB();
  return db
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
}

// 删除
async function remove(collectionName, id) {
  const db = await connectDB();
  return db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
}

// ----------------------------
// 4️⃣ Express 路由示例
// ----------------------------

// 测试连接
app.get("/test", async (req, res) => {
  try {
    await connectDB();
    res.send("MongoDB connection OK!");
  } catch (err) {
    console.error(err);
    res.status(500).send("MongoDB connection failed!");
  }
});

// 查询所有用户
app.get("/users", async (req, res) => {
  try {
    const users = await find("users");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

// 查询指定年龄用户
app.get("/users/age/:age", async (req, res) => {
  try {
    const age = parseInt(req.params.age);
    const users = await find("users", { age });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users by age");
  }
});

// 添加用户
app.post("/users", async (req, res) => {
  try {
    const result = await insert("users", req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting user");
  }
});

// 更新用户
app.put("/users/:id", async (req, res) => {
  try {
    const result = await update("users", req.params.id, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});

// 删除用户
app.delete("/users/:id", async (req, res) => {
  try {
    const result = await remove("users", req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

// ----------------------------
// 5️⃣ 启动服务
// ----------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

### **使用方法**

1. 确保 MongoDB 已启动：

```bash
mongod --dbpath "你的数据库路径"
```

2. 安装依赖：

```bash
npm install express mongodb
```

3. 启动服务：

```bash
node app.js
```

4. 使用 Postman 或浏览器测试：

* 测试连接：`GET http://localhost:3000/test`
* 查询用户：`GET http://localhost:3000/users`
* 查询指定年龄：`GET http://localhost:3000/users/age/22`
* 添加用户：`POST http://localhost:3000/users`，Body(JSON)：

```json
{
  "name": "Alice",
  "age": 22,
  "email": "alice@example.com"
}
```

* 更新用户：`PUT http://localhost:3000/users/<用户ID>`，Body(JSON)：

```json
{
  "age": 23
}
```

* 删除用户：`DELETE http://localhost:3000/users/<用户ID>`

---

如果你需要，我可以帮你写一个 **更详细的测试版**，包括 **批量插入、复杂查询、分页查询、模糊搜索** 等常见操作，像一个 **Node + MongoDB 全功能操作大全**。

你希望我帮你写吗？
