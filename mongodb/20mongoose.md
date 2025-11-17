在 **Express** 项目中使用 **Mongoose** 进行 **MongoDB** 数据库的操作是非常常见的做法。Mongoose 是一个对象数据建模（ODM）库，它提供了一个非常强大的 API 来与 MongoDB 数据库进行交互。

### 一、安装 Mongoose

首先，确保你已经安装了 Mongoose 和 Express：

```bash
npm install express mongoose
```

### 二、创建一个基本的 Express 和 Mongoose 项目结构

假设我们要建立一个简单的用户管理系统，用户信息包括：`name`、`email` 和 `age`。以下是创建这个项目的结构。

#### 1. 初始化项目

```bash
mkdir express-mongoose-example
cd express-mongoose-example
npm init -y
npm install express mongoose
```

#### 2. 创建项目文件结构

```bash
express-mongoose-example/
├── models/
│   └── user.js
├── routes/
│   └── userRoutes.js
├── app.js
└── package.json
```

#### 3. 配置 Mongoose 与 Express

**`app.js`**

```javascript
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000;

// 解析 JSON 请求体
app.use(express.json());

// 连接 MongoDB
mongoose.connect('mongodb://localhost:27017/express_mongoose_example', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// 使用用户路由
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

#### 4. 创建用户模型

在 `models/user.js` 中，我们定义了一个 **User** 模型：

**`models/user.js`**

```javascript
const mongoose = require('mongoose');

// 定义用户 schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age cannot be greater than 120']
  }
});

// 创建并导出模型
const User = mongoose.model('User', userSchema);

module.exports = User;
```

#### 5. 创建用户路由

在 `routes/userRoutes.js` 中，我们定义了基本的 CRUD 操作。

**`routes/userRoutes.js`**

```javascript
const express = require('express');
const User = require('../models/user');
const router = express.Router();

// 创建用户
router.post('/', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = new User({ name, email, age });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取单个用户
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新用户
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 删除用户
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

#### 6. 启动服务器

在项目根目录下运行以下命令来启动 Express 应用：

```bash
node app.js
```

服务器会启动在 `http://localhost:3000` 上。

### 三、Mongoose 的常见操作

Mongoose 提供了许多强大的功能来处理 MongoDB 数据库。下面是一些常见的操作：

#### 1. **创建文档 (Create)**

使用 `save()` 方法将一个新实例保存到数据库。

```javascript
const user = new User({
  name: 'Alice',
  email: 'alice@example.com',
  age: 25
});
user.save()
  .then(savedUser => {
    console.log('User saved:', savedUser);
  })
  .catch(err => {
    console.error('Error saving user:', err);
  });
```

#### 2. **查询文档 (Read)**

* **获取所有文档**：使用 `find()` 方法。

```javascript
User.find()
  .then(users => {
    console.log('Users:', users);
  })
  .catch(err => {
    console.error('Error fetching users:', err);
  });
```

* **获取单个文档**：使用 `findById()` 方法。

```javascript
User.findById('60d69c7c2e3e141ad9c6cd50')
  .then(user => {
    console.log('User:', user);
  })
  .catch(err => {
    console.error('Error fetching user:', err);
  });
```

#### 3. **更新文档 (Update)**

使用 `findByIdAndUpdate()` 或 `updateOne()`。

```javascript
User.findByIdAndUpdate('60d69c7c2e3e141ad9c6cd50', { age: 30 }, { new: true })
  .then(updatedUser => {
    console.log('Updated user:', updatedUser);
  })
  .catch(err => {
    console.error('Error updating user:', err);
  });
```

#### 4. **删除文档 (Delete)**

使用 `findByIdAndDelete()` 或 `deleteOne()`。

```javascript
User.findByIdAndDelete('60d69c7c2e3e141ad9c6cd50')
  .then(deletedUser => {
    console.log('Deleted user:', deletedUser);
  })
  .catch(err => {
    console.error('Error deleting user:', err);
  });
```

#### 5. **条件查询和排序 (Find with conditions and sorting)**

```javascript
User.find({ age: { $gte: 18 } })
  .sort({ age: -1 })  // 按年龄降序排序
  .then(users => {
    console.log('Adults:', users);
  })
  .catch(err => {
    console.error('Error fetching users:', err);
  });
```

#### 6. **聚合操作 (Aggregation)**

Mongoose 支持 MongoDB 的聚合管道。以下是一个简单的例子：

```javascript
User.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $group: { _id: '$age', count: { $sum: 1 } } }
])
  .then(result => {
    console.log('Aggregation result:', result);
  })
  .catch(err => {
    console.error('Error in aggregation:', err);
  });
```

### 四、总结

通过上面的示例，我们涵盖了 Mongoose 在 Express 项目中的常见操作，包括：

* 定义模型和 Schema。
* 创建、读取、更新、删除文档（CRUD 操作）。
* 条件查询、排序、聚合等高级操作。

在实际项目中，你可以根据业务需求，灵活运用这些功能来管理 MongoDB 数据库中的数据。
