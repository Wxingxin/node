好的，作为 Node.js 小白，我将会详细讲解如何在使用 **Express** 框架和 **MongoDB** 数据库时，创建集合和建立连接。MongoDB 是一个 NoSQL 数据库，通常用于存储 JSON 格式的数据。使用 Express 来开发 Web 应用时，MongoDB 是非常常见的数据库选择之一。

我们将一步一步地完成以下任务：

1. 安装 Express 和 MongoDB 相关依赖。
2. 连接 MongoDB 数据库。
3. 创建一个集合。
4. 插入数据到集合中。
5. 使用 Express 创建一个简单的 API 来操作数据。

### 1. 安装必要的依赖

首先，你需要安装一些必要的 npm 包，分别是 `express` 和 `mongoose`（`mongoose` 是用于 MongoDB 数据库的 ODM（对象数据建模）库，它提供了简化的 API 来操作 MongoDB）。

1. 在项目文件夹中打开命令行。

2. 初始化一个新的 npm 项目：

   ```bash
   npm init -y
   ```

3. 安装 Express 和 Mongoose：

   ```bash
   npm install express mongoose
   ```

### 2. 连接到 MongoDB 数据库

你需要连接到 MongoDB 数据库，假设你已经有一个 MongoDB 实例或者使用了 MongoDB Atlas（云端 MongoDB 服务）。

#### 2.1 **本地 MongoDB 连接**

如果你在本地运行 MongoDB，通常它默认会在端口 `27017` 上运行，数据库名称默认是 `test`。

你可以使用以下代码连接到 MongoDB 本地实例：

```javascript
const mongoose = require('mongoose');

// MongoDB 连接字符串
const dbURI = 'mongodb://localhost:27017/mydatabase';  // 连接到本地数据库

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Failed to connect to MongoDB', err);
  });
```

#### 2.2 **MongoDB Atlas 连接**

如果你使用 MongoDB Atlas，可以从你的 MongoDB Atlas 控制台中获取一个连接 URI。连接 URI 通常类似于：

```javascript
const mongoose = require('mongoose');

// MongoDB Atlas 连接字符串
const dbURI = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.log('Failed to connect to MongoDB Atlas', err);
  });
```

### 3. 创建集合和模型（Model）

MongoDB 在创建文档时会自动创建集合。但在使用 Mongoose 时，我们通常创建一个 **模型（Model）** 来定义数据结构和操作数据。

#### 3.1 **定义一个 Schema**

我们先定义一个 `Schema`（模式），它规定了集合中文档的结构。例如，假设我们要创建一个用户集合 `User`，它包含 `name` 和 `email` 字段。

```javascript
const mongoose = require('mongoose');

// 定义一个用户的 Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// 创建一个 User 模型
const User = mongoose.model('User', userSchema);

module.exports = User;
```

* `userSchema` 是一个 **Schema**，它描述了每个文档的结构。
* `User` 是我们通过 `mongoose.model()` 创建的模型（Model），它可以用来操作数据库中的数据。

#### 3.2 **创建集合**

在 MongoDB 中，集合会自动创建，无需显式创建，但我们可以通过模型来插入数据，MongoDB 会在数据库中创建集合。

### 4. 插入数据到集合

我们可以使用模型插入数据到集合中。在 Express 路由中插入数据。

#### 4.1 **插入数据**

我们将使用 Express 来创建一个 API 路由，通过 POST 请求插入数据。

```javascript
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // 引入我们之前定义的 User 模型

const app = express();

// 使用中间件解析 JSON 请求体
app.use(express.json());

// 创建一个 POST 路由来插入数据
app.post('/add-user', async (req, res) => {
  try {
    const { name, email } = req.body;

    // 创建一个新的 User 实例
    const newUser = new User({ name, email });

    // 保存用户数据到数据库
    await newUser.save();

    res.status(201).json({
      message: 'User added successfully',
      user: newUser,
    });
  } catch (err) {
    res.status(400).json({
      error: 'Failed to add user',
      details: err,
    });
  }
});

// 连接到 MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch(err => {
    console.log('Failed to connect to MongoDB', err);
  });
```

**说明**：

* `POST /add-user` 路由接收 JSON 格式的请求体，包含用户的 `name` 和 `email`。
* 创建了一个新的 `User` 实例并调用 `.save()` 方法将数据保存到 MongoDB 集合中。
* 当数据插入成功时，返回 `201` 状态和用户信息；如果出错，则返回 `400` 状态和错误信息。

#### 4.2 **测试 API**

你可以使用 Postman 或 cURL 工具来测试这个 API。发送以下 POST 请求：

**请求 URL**：

```
http://localhost:3000/add-user
```

**请求体**（JSON 格式）：

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

如果成功，响应将如下所示：

```json
{
  "message": "User added successfully",
  "user": {
    "_id": "603d9f3c7e4b1b2322f1e44c",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2022-02-21T05:30:12.760Z",
    "__v": 0
  }
}
```

### 5. **查询集合中的数据**

你可以使用 Mongoose 模型的方法来查询集合中的数据。比如，我们可以通过用户的 `email` 查询该用户。

#### 5.1 **查询数据**

```javascript
app.get('/get-user', async (req, res) => {
  try {
    const { email } = req.query;  // 从查询参数获取 email

    // 查询数据库
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User found',
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch user',
      details: err,
    });
  }
});
```

#### 5.2 **测试查询 API**

你可以通过浏览器或 Postman 发送 GET 请求：

**请求 URL**：

```
http://localhost:3000/get-user?email=john@example.com
```

如果用户存在，响应将返回该用户的详细信息。

### 6. **总结**

通过上述步骤，我们完成了以下工作：

* 使用 **Mongoose** 配置了一个连接到 MongoDB 的 Express 应用。
* 创建了一个 **User** 模型和一个 **Schema** 来定义用户数据结构。
* 编写了一个 POST 路由，用于插入数据到 MongoDB 集合。
* 编写了一个 GET 路由，用于查询数据。

这些是使用 Express 和 MongoDB 时常见的操作，之后你可以扩展应用，增加更多路由、处理更新、删除操作等。
