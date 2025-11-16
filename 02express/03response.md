下面给你一份 **史上最详细、最系统的《Node.js / Express 中 request 和 response 的属性 + 方法大全》**，包含：

✔ 最常用属性与方法
✔ Express 对 req/res 的扩展示例
✔ 经典代码场景（文件上传、JSON、header、cookie 等）
✔ 实际项目中常用写法

非常适合你 Express 后端开发学习。

---

# 🟦 一、**Express Request（req）属性与方法大全**

Express 的 `req` 继承自 Node.js 的 `IncomingMessage`，并额外扩展了很多属性。

---

# 🟩 **1. 常用属性（Express 扩展）**

| 属性                             | 类型     | 说明                                |
| ------------------------------ | ------ | --------------------------------- |
| **req.body**                   | Object | POST/PUT 请求体（需要 `express.json()`） |
| **req.query**                  | Object | URL 查询参数，如 `/user?id=1`           |
| **req.params**                 | Object | 动态路由参数，如 `/user/:id`              |
| **req.headers / req.header()** | Object | 请求头                               |
| **req.method**                 | string | 请求方法，如 `"GET"`                    |
| **req.url**                    | string | 请求路径                              |
| **req.path**                   | string | 纯路径，不含 query                      |
| **req.hostname**               | string | 主机名（不含端口）                         |
| **req.ip**                     | string | 客户端 IP                            |
| **req.protocol**               | string | "http" / "https"                  |
| **req.secure**                 | bool   | 是否 https                          |
| **req.cookies**                | Object | cookie-parser 扩展后的 cookies        |
| **req.signedCookies**          | Object | 已签名的 cookies                      |
| **req.baseUrl**                | string | 路由挂载路径                            |
| **req.originalUrl**            | string | 原始 URL（包含 query）                  |
| **req.xhr**                    | bool   | 判断是否 Ajax 请求                      |
| **req.route**                  | Object | 当前匹配的路由                           |
| **req.app**                    | Object | express 实例（app）                   |

---

# 🟩 **2. 常用方法（Express）**

| 方法                      | 说明                                 |
| ----------------------- | ---------------------------------- |
| **req.get(headerName)** | 获取某个请求头                            |
| **req.accepts(types)**  | 判断客户端能接受哪种类型                       |
| **req.is(type)**        | 判断 Content-Type，如 `req.is("json")` |
| **req.param(name)**     | 从 params、query、body 里取值            |
| **req.range(size)**     | Range 请求处理（下载时用）                   |

---

# 🟦 二、Node.js 原生 request（IncomingMessage）属性（Express 也继承了）

| 属性                  | 说明           |
| ------------------- | ------------ |
| **req.httpVersion** | HTTP 版本      |
| **req.rawHeaders**  | 原始 header 数组 |
| **req.rawTrailers** | 原始 trailers  |
| **req.socket**      | TCP 连接对象     |
| **req.aborted**     | 请求是否被取消      |

---

# 🟦 三、实际使用示例

### 读取 body：

```js
app.post("/login", (req, res) => {
  console.log(req.body); 
});
```

### 动态路由：

```js
app.get("/user/:id", (req, res) => {
  console.log(req.params.id);
});
```

### Query 参数：

```js
app.get("/search", (req, res) => {
  console.log(req.query.keyword);
});
```

---

# 🟥 四、Express Response（res）属性与方法大全

Express 的 `res` 继承自 Node.js 的 `ServerResponse`，添加了强大的方法。

---

# 🟧 **1. 常用属性**

| 属性                  | 说明               |
| ------------------- | ---------------- |
| **res.headersSent** | 是否已经发出 header    |
| **res.locals**      | 保存中间件数据（模板渲染时常用） |

---

# 🟧 **2. 常用方法（Express 扩展）**

| 方法                           | 说明                             |
| ---------------------------- | ------------------------------ |
| **res.send()**               | 发送数据（自动判断 JSON / 字符串 / Buffer） |
| **res.json()**               | 返回 JSON                        |
| **res.status()**             | 设置 HTTP 状态码                    |
| **res.set() / res.header()** | 设置 header                      |
| **res.type()**               | 设置 Content-Type                |
| **res.sendFile()**           | 发送文件（下载/预览）                    |
| **res.download()**           | 下载文件                           |
| **res.redirect()**           | 重定向                            |
| **res.cookie()**             | 设置 cookie（需 cookie-parser）     |
| **res.clearCookie()**        | 清除 cookie                      |
| **res.append()**             | 追加 header                      |
| **res.location()**           | 设置 Location header             |
| **res.end()**                | 结束响应（不推荐直接使用）                  |

---

# 🟧 **3. Node 原生 ServerResponse（Express 继承）**

| 方法                     | 说明         |
| ---------------------- | ---------- |
| **res.write()**        | 写入部分响应     |
| **res.end()**          | 结束响应       |
| **res.writeHead()**    | 写入 header  |
| **res.getHeader()**    | 获取 header  |
| **res.setHeader()**    | 设置 header  |
| **res.removeHeader()** | 删除 header  |
| **res.hasHeader()**    | 是否有 header |

---

# 🟥 五、Response 常用示例

### 返回 JSON

```js
res.json({ message: "OK", data: user });
```

### 设置状态码

```js
res.status(401).json({ message: "权限不足" });
```

### 设置 header

```js
res.set("Content-Type", "text/plain");
```

### 重定向

```js
res.redirect("https://google.com");
```

### 下载文件

```js
res.download("./file/report.pdf");
```

### 发送静态文件

```js
res.sendFile(`/root/public/index.html`);
```

### 发送 cookie

```js
res.cookie("token", "xxx", { httpOnly: true });
```

---

# 🟦 六、Request + Response 实际项目最佳实践

### 登录接口

```js
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "用户不存在" });

  res.json({
    msg: "登录成功",
    token: "xxxxx"
  });
});
```

---

### 文件上传 multer 示例

```js
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);  // req 文件
  res.json({ filename: req.file.filename });
});
```

---

### 自定义 header

```js
app.get("/demo", (req, res) => {
  res.set("X-App-Version", "1.0.0");
  res.send("hello");
});
```

---

# 🟦 七、所有属性和方法的结构图（总结版）

## ✔ Express Request（req）

* req.body
* req.query
* req.params
* req.headers / req.header()
* req.method
* req.url / req.path / req.originalUrl
* req.hostname
* req.ip
* req.cookies
* req.signedCookies
* req.xhr
* req.route
* req.app

**方法：**

* req.get()
* req.accepts()
* req.is()
* req.param()
* req.range()

---

## ✔ Express Response（res）

* res.locals
* res.headersSent

**方法：**

* res.send()
* res.json()
* res.status()
* res.set() / res.header()
* res.type()
* res.sendFile()
* res.download()
* res.redirect()
* res.cookie()
* res.clearCookie()
* res.append()
* res.location()
* res.end()

---

# ✔ 想进一步学习吗？

我可以继续给你：

### 🔥 1. 「Express 中常见响应写法大全」

例：成功、失败、分页、统一返回格式

### 🔥 2. 「Node 原生 HTTP request 和 response 的底层原理图」

### 🔥 3. 「request 和 response 全属性完整表格版（超详细）」

（适合打印或收藏）

你需要哪一个？


# 🚀 一、Express 中 req（request）常用属性 & 方法大全（逐条讲解）

## ✅ 1. `req.params`

**路径参数**，来自 `/users/:id` 这种 URL。

### 经典案例

```js
app.get("/users/:id", (req, res) => {
  console.log(req.params.id);  // 获取 /users/100 → "100"
  res.send("用户 ID: " + req.params.id);
});
```

---

## ✅ 2. `req.query`

**URL 查询参数**，如 `/users?name=jack&age=20`

### 经典案例

```js
app.get("/search", (req, res) => {
  console.log(req.query);  // { name: 'jack', age: '20' }
  res.send("查询参数：" + JSON.stringify(req.query));
});
```

---

## ✅ 3. `req.body`

**POST / PUT 的请求体数据**
需要中间件 `express.json()` 才能解析 JSON。

### 经典案例

```js
app.use(express.json());

app.post("/login", (req, res) => {
  console.log(req.body);  // { username: 'tom', password: '123' }
  res.send("登录成功");
});
```

---

## ✅ 4. `req.headers`

客户端请求的所有 header。

### 经典案例

```js
app.get("/info", (req, res) => {
  console.log(req.headers['user-agent']);
  res.send("header 已打印");
});
```

---

## ✅ 5. `req.method`

GET / POST / PUT / DELETE

### 经典案例

```js
app.use((req, res, next) => {
  console.log("请求方法：", req.method);
  next();
});
```

---

## ✅ 6. `req.url`

访问的 URL（不包含域名）。

---

## 7. `req.path`

仅路径部分，如 `/users/list`

---

## 8. `req.ip`

客户端 IP 地址。

---

## 9. `req.cookies`

需要 `cookie-parser` 中间件。

### 案例

```js
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log(req.cookies);
});
```

---

## 10. `req.get()`

获取 header

```js
req.get("Host")
```

---

# 🟦 二、Express 中 res（response）常用属性 & 方法大全（逐条讲解）

---

## ✅ 1. `res.send()`

发送响应（字符串、对象、HTML）。

### 案例

```js
res.send({ message: "OK" });
```

---

## ✅ 2. `res.json()`

响应 JSON（`send()` 的 JSON 版本）

### 案例

```js
res.json({ code: 200, data: "success" });
```

---

## ✅ 3. `res.status()`

设置 HTTP 状态码。

### 案例

```js
res.status(404).send("Not Found");
```

---

## ✅ 4. `res.set()`

手动设置响应头。

### 案例

```js
res.set("Content-Type", "text/plain");
res.send("ok");
```

---

## ✅ 5. `res.redirect()`

重定向到其它页面。

### 案例

```js
res.redirect("https://google.com");
```

---

## ✅ 6. `res.sendFile()`

返回一个文件（常用于前端 HTML）。

### 案例

```js
res.sendFile(__dirname + "/index.html");
```

---

## ✅ 7. `res.cookie()`

发送 cookie（需要 cookie-parser）

### 案例

```js
res.cookie("token", "abcdef", { httpOnly: true });
res.send("已设置 cookie");
```

---

## ✅ 8. `res.clearCookie()`

清除 cookie。

---

## 9. `res.download()`

让用户下载文件。

---

## 10. `res.end()`

结束响应（短小精悍）。

---

# 🔥 三、项目中最常用的方法 & 属性 —— 深度讲解（结合真实项目）

下面我用 **真实项目结构** 来给你讲最常用的操作（你平常最会遇到的点）。

---

# ⭐ 1. 登录（req.body + res.json）

```js
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "123456") {
    return res.json({ code: 200, token: "xxtokenxx" });
  }

  res.status(400).json({ code: 400, msg: "用户名或密码错误" });
});
```

**核心使用：**

* `req.body`
* `res.json()`
* `res.status()`

---

# ⭐ 2. 查询列表（req.query）

```js
app.get("/api/user", (req, res) => {
  const { page, size } = req.query;

  res.json({
    page,
    size,
    list: ["tom", "jack"],
  });
});
```

常用在后台管理系统：分页查询。

---

# ⭐ 3. 查看详情（req.params）

```js
app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  res.json({ id: userId, name: "张三" });
});
```

---

# ⭐ 4. 上传文件（req.file）

这里需要 `multer`。

```js
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("avatar"), (req, res) => {
  console.log(req.file);
  res.send("上传成功");
});
```

**最常用于：头像上传、文章图片上传。**

---

# ⭐ 5. 设置 token（res.cookie）

```js
res.cookie("token", "abc123", {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000
});
```

---

# ⭐ 6. 自定义 header（res.set）

```js
res.set("X-Powered-By", "Node-Server");
```

---

# ⭐ 7. 获取 header（req.get）

```js
const token = req.get("Authorization");
```

---

# 🚀 四、把这些做成一个经典项目（你能直接用的模板）

下面提供一个 **完整的 Express API 模板**，你以后项目都能从这里开始。

```js
const express = require("express");
const app = express();
const multer = require("multer");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const upload = multer({ dest: "uploads/" });

// 登录
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "123456") {
    res.cookie("token", "abcd", { httpOnly: true });
    return res.json({ code: 200 });
  }
  res.status(400).json({ msg: "error" });
});

// 分页查询
app.get("/api/list", (req, res) => {
  const { page = 1, size = 10 } = req.query;
  res.json({ page, size, list: [] });
});

// 详情
app.get("/api/item/:id", (req, res) => {
  res.json({ id: req.params.id });
});

// 上传文件
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});

// 服务器启动
app.listen(3000, () => console.log("Server running at 3000"));
```

---

# 🎯 总结：最常用的 req/res 方法（你必须记住的）

### req（请求）

| 方法/属性                 | 作用             |
| --------------------- | -------------- |
| req.body              | POST/PUT 提交的数据 |
| req.params            | 动态路由参数         |
| req.query             | URL 查询参数       |
| req.headers / req.get | header 信息      |
| req.method            | 请求方法           |
| req.ip                | IP 地址          |

### res（响应）

| 方法           | 作用        |
| ------------ | --------- |
| res.send     | 返回任意数据    |
| res.json     | 返回 JSON   |
| res.status   | 设置状态码     |
| res.set      | 设置 header |
| res.cookie   | 设置 cookie |
| res.sendFile | 发送文件      |
| res.redirect | 重定向       |

---

如果你需要，我还能给你：

### ✔ 最常见的 Express + MongoDB（Mongoose）项目

### ✔ 结合 token 身份验证（JWT）

### ✔ 结合前端 React / Vue 后台管理系统

### ✔ 结合用户登录 + 权限管理

你想让我给你生成一个 **完整项目模板** 吗？
