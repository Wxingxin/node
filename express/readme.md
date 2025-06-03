# get 和 其他 区别

### 一、核心区别对比表

| 特性             | **GET**                                 | **POST/PUT/DELETE 等**                 |
| ---------------- | --------------------------------------- | -------------------------------------- |
| **语义**         | 获取资源（只读操作）                    | 修改资源（创建、更新、删除等）         |
| **数据位置**     | 参数在 URL 查询字符串中（`?key=value`） | 参数在请求体（body）中                 |
| **安全性**       | 不安全（URL 会被记录，如浏览器历史）    | 较安全（数据不在 URL 中）              |
| **幂等性**       | 是（多次请求结果相同）                  | 不一定（POST 非幂等，PUT/DELETE 幂等） |
| **缓存性**       | 可被浏览器缓存                          | 通常不缓存                             |
| **数据长度限制** | 受 URL 长度限制（约 2000 字符）         | 无限制（取决于服务器配置）             |
| **典型场景**     | 查询数据（如搜索、分页）                | 提交表单、上传文件、更新数据库记录     |

### 二、本质区别详解

#### 1. **语义设计（最核心区别）**

- **GET**：设计用于获取资源，不应该对服务器数据产生副作用（如刷新页面不会创建新记录）。
- **POST/PUT/DELETE**：设计用于修改服务器状态（如创建订单、删除用户）。

#### 2. **数据传输方式**

- **GET**：参数通过 URL 传递，例如：
  ```
  https://api.example.com/users?name=john&age=30
  ```
- **POST/PUT**：参数封装在请求体中，例如：
  ```json
  {
    "name": "john",
    "age": 30
  }
  ```

#### 3. **安全性差异**

- **GET**：所有参数暴露在 URL 中，不适合传输敏感信息（如密码、信用卡号）。
- **POST**：数据在请求体中，URL 不包含敏感信息，但仍建议配合 HTTPS 使用。

#### 4. **幂等性（Idempotence）**

- **GET**：幂等（多次请求同一资源结果相同）。
- **POST**：非幂等（多次提交可能创建多条记录，如重复下单）。
- **PUT/DELETE**：幂等（多次更新或删除同一资源结果相同）。

#### 5. **浏览器行为**

- **GET**：可直接在地址栏输入 URL 触发，支持书签和历史记录。
- **POST**：必须通过表单或代码（如 `fetch`、Postman）触发，刷新页面可能提示“重新提交表单”。

### 三、常见误区澄清

#### 误区 1：“POST 比 GET 更安全”

- **真相**：POST 仅隐藏 URL 中的参数，但数据在网络中仍可能被截获。真正的安全需依赖 HTTPS。

#### 误区 2：“GET 只能用于获取简单数据，POST 用于复杂操作”

- **真相**：语义上，GET 应只用于获取资源，但技术上也可处理复杂逻辑（如批量查询）。

#### 误区 3：“POST 数据大小无限制”

- **真相**：服务器通常限制请求体大小（如 Node.js 默认 100kb），需配置中间件调整。

### 四、如何选择 HTTP 方法？

根据 **RESTful 设计原则**：

- 获取数据 → `GET`
- 创建资源 → `POST`
- 完整更新资源 → `PUT`
- 部分更新资源 → `PATCH`
- 删除资源 → `DELETE`

例如：

```bash
GET /users       # 获取用户列表
POST /users      # 创建新用户
PUT /users/123   # 更新用户 ID=123 的所有信息
DELETE /users/123 # 删除用户 ID=123
```

### 五、Express 示例：不同方法的实现

```javascript
const express = require("express");
const app = express();
app.use(express.json()); // 解析 JSON 请求体

// GET：获取用户列表
app.get("/users", (req, res) => {
  res.send("返回用户列表");
});

// POST：创建新用户
app.post("/users", (req, res) => {
  const newUser = req.body; // 获取请求体数据
  res.send(`创建用户：${newUser.name}`);
});

// PUT：更新用户
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  res.send(`更新用户 ${userId}：${JSON.stringify(updatedData)}`);
});

// DELETE：删除用户
app.delete("/users/:id", (req, res) => {
  res.send(`删除用户 ${req.params.id}`);
});
```

# 请求参数 request

## 请求参数

- **`req.params`**:

  - **用途:** 包含路由参数（URL 中 `:` 后面的部分）的对象。
  - **示例:** 对于路由 `/users/:id`，当请求 `/users/123` 时，`req.params.id` 为 `'123'`。

  ```js
  app.get("/users/:id", (req, res) => {
    const userId = req.params.id; // 例如：'123'
    res.send(`User ID: ${userId}`);
  });
  ```

- **`req.query`**:

  - **用途:** 包含 URL 查询字符串参数（`?` 后面的部分）的对象。
  - **示例:** 对于 URL `/search?q=nodejs&sort=desc`，`req.query` 将是 `{ q: 'nodejs', sort: 'desc' }`。

  ```js
  app.get("/search", (req, res) => {
    const query = req.query.q; // 例如：'nodejs'
    const sort = req.query.sort; // 例如：'desc'
    res.send(`Searching for: ${query}, sorted by: ${sort}`);
  });
  ```

- **`req.body`**:

  - **用途:** 包含请求体（Request Body）的对象。通常用于 POST、PUT 请求发送的数据。

  - **注意:** 默认情况下，`req.body` 是 `undefined`。你需要使用 Express 内置的中间件或第三方中间件（如 `body-parser`，但现在通常直接使用 `express.json()` 和 `express.urlencoded()`）来解析请求体。

  - **示例:**

    ```js
    app.use(express.json()); // 解析 JSON 格式的请求体
    app.use(express.urlencoded({ extended: true })); // 解析 URL-encoded 格式的请求体

    app.post("/submit", (req, res) => {
      const data = req.body; // 例如：{ name: 'Alice', age: 30 }
      res.send("Received data: " + JSON.stringify(data));
    });
    ```

## 请求头

- **`req.headers`**:

  - **用途:** 包含请求头（Request Headers）的对象。
  - **示例:** `req.headers['content-type']`、`req.headers['user-agent']` 等。

  ```js
  app.get("/headers", (req, res) => {
    const userAgent = req.headers["user-agent"];
    res.send(`User Agent: ${userAgent}`);
  });
  ```

## 请求信息

#### **`req.method`**

- **用途:** 获取请求的 HTTP 方法（例如 GET, POST, PUT, DELETE）。

- **示例:**

  JavaScript

  ```
  console.log(req.method); // 'GET' 或 'POST' 等
  ```

#### **`req.url` / `req.originalUrl`**

- **用途:**

  - `req.url`: 包含请求的 URL 路径和查询字符串（相对于**当前处理程序的挂载路径**）。
  - `req.originalUrl`: 包含客户端请求的**完整原始 URL 路径和查询字符串**。

- **区别示例:**

  ```js
  // 假设你有以下 Express 应用配置
  const router = express.Router();
  router.get("/items", (req, res) => {
    console.log("req.url:", req.url); // '/items?color=red'
    console.log("req.originalUrl:", req.originalUrl); // '/api/v1/items?color=red'
    res.send("Done");
  });
  app.use("/api/v1", router);

  // 当客户端请求：GET /api/v1/items?color=red
  ```

  在中间件或子路由中，`req.url` 会是相对于该中间件或子路由的路径，而 `req.originalUrl` 总是包含完整的请求路径。

#### **`req.path`**

- **用途:** 获取请求的 URL 路径部分，**不包含查询字符串**，并且已经过解码。

- **示例:**

  ```js
  // 请求：GET /products/123?category=electronics
  console.log(req.path); // '/products/123'
  ```

#### **`req.hostname`**

- **用途:** 获取请求的主机名（不含端口）。

- **示例:**

  ```js
  // 请求：http://www.example.com:3000/
  console.log(req.hostname); // 'www.example.com'
  ```

#### **`req.protocol`**

- **用途:** 获取请求的协议（'http' 或 'https'）。

- **重要:** 如果应用在代理（如 Nginx）后面，需设置 `app.enable('trust proxy');` 才能获取真实的协议。

- **示例:**

  ```js
  console.log(req.protocol); // 'http' 或 'https'
  ```

#### **`req.secure`**

- **用途:** 布尔值，如果请求是通过 HTTPS 连接发起的则为 `true`。等同于 `req.protocol === 'https'`。

- **重要:** 同样受 `app.enable('trust proxy');` 影响。

- **示例:**

  ```js
  if (req.secure) {
    console.log("Secure connection");
  }
  ```

#### **`req.ip`**

- **用途:** 获取客户端的 IP 地址。

- **重要:** 同样受 `app.enable('trust proxy');` 影响，以获取真实的客户端 IP。

- **示例:**

  ```js
  console.log(req.ip); // '192.168.1.1'
  ```

#### **`req.cookies`**

- **用途:** 获取客户端发送的 Cookie。

- **重要:** 默认情况下 `req.cookies` 是 `undefined`。你需要使用 `cookie-parser` 中间件来解析 Cookie。

- **示例:**

  ```js
  const cookieParser = require("cookie-parser");
  app.use(cookieParser());

  // 请求头：Cookie: session_id=abc; user_id=123
  console.log(req.cookies.session_id); // 'abc'
  ```

#### **`req.signedCookies`**

- **用途:** 获取客户端发送的**已签名的** Cookie。需要 `cookie-parser` 中间件和密钥。

- **示例:**

  ```js
  app.use(cookieParser("your-secret-key")); // 提供一个密钥
  // 如果客户端发送了签名 cookie，例如 s:my_signed_cookie.signature
  console.log(req.signedCookies.my_signed_cookie); // 原始值 'value'
  ```

#### **`req.fresh` / `req.stale`**

- **用途:** 布尔值，用于缓存协商。

  - `req.fresh`: 如果响应是“新鲜的”（客户端的缓存副本仍然有效），则为 `true`。
  - `req.stale`: 如果响应是“陈旧的”（客户端的缓存副本需要更新），则为 `true`。

- **示例:**

  ```js
  app.get("/cached-data", (req, res) => {
    if (req.fresh) {
      res.status(304).end(); // 发送 304 Not Modified
    } else {
      // 返回最新数据，并设置 ETag 或 Last-Modified 头
      res.set("ETag", "some-etag-value");
      res.send("New data");
    }
  });
  ```

#### **`req.xhr`**

- **用途:** 布尔值，如果请求是由 `XMLHttpRequest`（或 Fetch API）发起的（即 AJAX 请求），则为 `true`。它是通过检查 `X-Requested-With` 请求头是否为 `'XMLHttpRequest'` 来实现的。

- **示例:**

  ```js
  app.get("/ajax-only", (req, res) => {
    if (req.xhr) {
      res.json({ message: "This is an AJAX response." });
    } else {
      res.status(403).send("Forbidden: Only AJAX requests allowed.");
    }
  });
  ```

## 文件上传 （需要配合 multer 等中间件）

暂时不学

# 相应参数 response

### 发送响应

#### **`res.send([body])`**

- **用途:** 发送各种类型的响应。这是最通用的方法。Express 会根据 `body` 的类型自动设置 `Content-Type` 头：

  - `String` (字符串): 默认 `Content-Type: text/html`。
  - `Buffer` (Buffer 对象): 默认 `Content-Type: application/octet-stream`。
  - `Object` 或 `Array` (JavaScript 对象或数组): 默认 `Content-Type: application/json`，并自动调用 `JSON.stringify()`。

- **示例:**

  ```js
  res.send("<h1>Hello, Express!</h1>"); // 发送 HTML 字符串
  res.send({ message: "Data received", status: "success" }); // 发送 JSON
  res.send(Buffer.from("some binary data")); // 发送二进制数据
  ```

#### **`res.json([body])`**

- **用途:** 发送 JSON 格式的响应。它会自动设置 `Content-Type: application/json` 并调用 `JSON.stringify()`。这是构建 RESTful API 最常用的方法。

- **示例:**

  ```js
  res.json({
    id: 1,
    name: "Product A",
    price: 99.99,
  });
  ```

#### **`res.sendFile(path[, options][, callback])`**

- **用途:** 发送指定路径的文件作为响应。这个方法会根据文件扩展名自动设置 `Content-Type`。通常用于发送静态 HTML、图片、PDF 等文件。

- **注意:** 需要提供文件的绝对路径。推荐使用 `path.join()` 和 `__dirname` 来构建安全可靠的路径。

- **示例:**

  ```js
  const path = require("path");
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
  ```

### 设置响应头

#### **`res.set(field[, value])` / `res.header(field[, value])`**

- **用途:** 设置响应头（Response Header）。`res.set()` 和 `res.header()` 是等价的。

- **参数:** 可以是一个 `field` 和 `value` 对，也可以是一个包含多个键值对的对象。

- **示例:**

  ```js
  res.set("Content-Type", "text/plain"); // 设置 Content-Type
  res.set({
    "X-Powered-By": "My Express App",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  });
  res.send("Custom headers sent!");
  ```

### 状态码

#### **`res.status(code)`**

- **用途:** 设置 HTTP 响应的状态码（例如 200 OK, 404 Not Found, 500 Internal Server Error, 201 Created 等）。

- **注意:** 这是一个**链式方法**，它返回 `res` 对象本身，所以你通常会在它后面链式调用其他发送响应的方法（如 `send()`, `json()`, `end()`）。

- **示例:**

  ```js
  res.status(404).send("Resource Not Found");
  res.status(201).json({ message: "User created successfully" });
  ```

### Cookie 和 Session

#### **`res.cookie(name, value[, options])`**

- **用途:** 设置一个 Cookie。

- **参数:** `name` (Cookie 名称), `value` (Cookie 值), `options` (可选，设置 Cookie 的属性，如 `maxAge`, `expires`, `httpOnly`, `secure`, `domain`, `path` 等)。

- **示例:**

  ```js
  res.cookie("session_id", "abcd123xyz", {
    maxAge: 3600000,
    httpOnly: true,
    secure: true,
  }); // 设置一个 1 小时后过期的安全 HTTP-Only Cookie
  res.send("Cookie set!");
  ```

#### **`res.clearCookie(name[, options])`**

- **用途:** 清除一个 Cookie。通常通过设置 `expires` 到一个过去的时间来实现。

- **示例:**

  ```js
  res.clearCookie("session_id");
  res.send("Cookie cleared!");
  ```

### 视图渲染（需配置模板引擎如 EJS）

#### **`res.render(view[, locals][, callback])`**

- **用途:** 渲染一个视图模板并发送渲染后的 HTML。这要求你已经配置了 Express 的模板引擎（例如 EJS, Pug, Handlebars）。

- **参数:**

  - `view`: 模板文件的名称。
  - `locals`: 传递给模板的数据对象。

- **示例:**

  ```js
  // (假设已配置模板引擎，例如 app.set('view engine', 'ejs');)
  app.get("/profile/:username", (req, res) => {
    const username = req.params.username;
    // 假设从数据库获取用户信息
    const user = { name: username, email: `${username}@example.com` };
    res.render("profile", { user: user, title: "用户详情" });
  });
  ```
