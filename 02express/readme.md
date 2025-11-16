

# 🚀 一、什么是中间件（Middleware）

> 中间件是一个函数，它能在请求（Request）到达最终路由处理之前或响应（Response）返回之前执行。

中间件函数的基本结构：

```js
function middleware(req, res, next) {
  // 执行逻辑（例如：日志、权限验证、解析数据）
  next(); // 调用 next() 才能让请求继续下一个中间件或路由
}
```

---

# 🧭 二、Express 中间件分类总览

Express 的中间件主要分为 5 大类：

| 类型             | 注册方式                               | 应用范围               | 是否要 next() | 示例                  |
| -------------- | ---------------------------------- | ------------------ | ---------- | ------------------- |
| **1. 应用级中间件**  | `app.use()` / `app.METHOD()`       | 全局或指定路由            | ✅          | `app.use(logger)`   |
| **2. 路由级中间件**  | `router.use()` / `router.METHOD()` | 某个路由模块             | ✅          | `router.use(auth)`  |
| **3. 内置中间件**   | 内置在 express 中                      | 通用功能（静态文件、解析 body） | ❌（自动处理）    | `express.json()`    |
| **4. 第三方中间件**  | 需安装 npm 包                          | 功能增强（CORS、JWT、上传）  | ❌          | `cors()`、`multer()` |
| **5. 错误处理中间件** | `(err, req, res, next)`            | 捕获错误并统一处理          | ❌          | 自定义错误日志             |

---

# 🧱 三、① 应用级中间件（Application-level）

👉 使用 `app.use()` 或 `app.METHOD()` 绑定到全局或特定路径。

### ✅ 全局中间件

```js
const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log('请求到达时间:', new Date());
  next();
});
```

### ✅ 路径级中间件

```js
app.use('/api', (req, res, next) => {
  console.log('访问 /api 的请求');
  next();
});
```

📌 执行顺序：
按照注册顺序从上往下执行，匹配路径后再继续。

---

# 🧩 四、② 路由级中间件（Router-level）

> 用 `express.Router()` 创建模块化的中间件。
> 常用于大型项目中按功能拆分路由。

```js
const express = require('express');
const router = express.Router();

// 路由级中间件
router.use((req, res, next) => {
  console.log('路由级中间件执行');
  next();
});

router.get('/user', (req, res) => res.send('用户信息'));
module.exports = router;
```

主应用引入：

```js
const userRouter = require('./routes/user');
app.use('/api', userRouter);
```

📘 常用场景：

* 用户模块独立
* 日志记录
* 路由权限控制

---

# ⚙️ 五、③ 内置中间件（Built-in Middleware）

Express 从 v4.x 起自带了几个常用的中间件：

| 中间件                    | 功能                               | 示例                                                |
| ---------------------- | -------------------------------- | ------------------------------------------------- |
| `express.json()`       | 解析 JSON 格式请求体                    | `app.use(express.json())`                         |
| `express.urlencoded()` | 解析表单请求体（`x-www-form-urlencoded`） | `app.use(express.urlencoded({ extended: true }))` |
| `express.static()`     | 托管静态文件                           | `app.use(express.static('public'))`               |

### 🌰 例子：

```js
app.use(express.json());
app.post('/login', (req, res) => {
  console.log(req.body); // 自动解析 JSON 请求体
  res.send('ok');
});
```

---

# 🧩 六、④ 第三方中间件（Third-party Middleware）

> 由社区开发的 npm 包，帮助实现常用功能（日志、跨域、文件上传、鉴权等）

| 中间件               | 说明              | 安装                      | 示例                        |
| ----------------- | --------------- | ----------------------- | ------------------------- |
| `morgan`          | HTTP 请求日志       | `npm i morgan`          | `app.use(morgan('dev'))`  |
| `cors`            | 解决跨域问题          | `npm i cors`            | `app.use(cors())`         |
| `multer`          | 文件上传            | `npm i multer`          | `upload.single('avatar')` |
| `express-session` | 管理登录会话          | `npm i express-session` | `app.use(session({...}))` |
| `cookie-parser`   | 解析 Cookie       | `npm i cookie-parser`   | `app.use(cookieParser())` |
| `helmet`          | 安全防护（设置 HTTP 头） | `npm i helmet`          | `app.use(helmet())`       |

---

### 🌰 常见使用示例

#### ✅ CORS 解决跨域

```js
const cors = require('cors');
app.use(cors());
```

#### ✅ 文件上传

```js
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('avatar'), (req, res) => {
  res.send('上传成功');
});
```

#### ✅ 请求日志（morgan）

```js
const morgan = require('morgan');
app.use(morgan('dev'));
```

---

# 💥 七、⑤ 错误处理中间件（Error-handling Middleware）

> 专门用于捕获错误（包括 `throw` 或 `next(err)`）
> 形参必须是 **4 个**：`(err, req, res, next)`

### ✅ 示例：

```js
app.use((err, req, res, next) => {
  console.error('错误捕获:', err.message);
  res.status(500).json({ error: err.message });
});
```

### ✅ 配合 next(err)

```js
app.get('/', (req, res, next) => {
  try {
    throw new Error('服务器出错');
  } catch (err) {
    next(err);
  }
});
```

📌 错误中间件 **必须写在所有路由之后**。

---

# 🧠 八、Express 中间件执行流程图

```
请求进入 →
  应用级中间件(app.use)
    ↓
  路由级中间件(router.use)
    ↓
  目标路由(app.get/post)
    ↓
  如果出错 → 错误处理中间件
    ↓
  响应返回客户端
```

---

# 🧰 九、多个中间件的组合执行（洋葱模型）

```js
app.use((req, res, next) => {
  console.log('中间件 1 start');
  next();
  console.log('中间件 1 end');
});

app.use((req, res, next) => {
  console.log('中间件 2 start');
  next();
  console.log('中间件 2 end');
});

app.get('/', (req, res) => {
  console.log('路由逻辑');
  res.send('ok');
});
```

输出：

```
中间件 1 start
中间件 2 start
路由逻辑
中间件 2 end
中间件 1 end
```

📘 原理：中间件执行是「嵌套」而不是简单顺序（类似递归栈结构）。

---

# 🧩 十、项目中常见中间件用途总结

| 目的         | 常用中间件                                | 说明           |
| ---------- | ------------------------------------ | ------------ |
| 请求日志       | `morgan`                             | 打印访问记录       |
| 解析请求体      | `express.json`, `express.urlencoded` | 支持 JSON/表单   |
| 静态资源       | `express.static`                     | 图片、CSS、JS 文件 |
| 跨域         | `cors`                               | 允许前端访问接口     |
| 文件上传       | `multer`                             | 上传头像或图片      |
| 用户认证       | 自定义中间件 / JWT                         | 校验 Token     |
| 错误处理       | 自定义 error 中间件                        | 捕获异常         |
| 安全防护       | `helmet`                             | 设置安全响应头      |
| Cookie 管理  | `cookie-parser`                      | 操作 cookies   |
| Session 登录 | `express-session`                    | 保存登录状态       |

---

# 🎯 十一、总结重点记忆

| 类别   | 特征              | 是否 next() | 使用场景    |
| ---- | --------------- | --------- | ------- |
| 应用级  | `app.use` 定义    | ✅         | 全局功能    |
| 路由级  | `router.use` 定义 | ✅         | 局部功能    |
| 内置   | `express.xxx()` | ❌         | 基础解析/静态 |
| 第三方  | 通过 npm 安装       | ❌         | 功能增强    |
| 错误处理 | 4 个参数           | ❌         | 捕获错误    |

---

要不要我下一步帮你写一份：

> ✅「Express 中间件在登录注册系统中的完整实战应用」——
> 包括 **token 验证中间件**、**日志中间件**、**错误处理中间件**、**请求体解析中间件** 一套完整项目结构？
