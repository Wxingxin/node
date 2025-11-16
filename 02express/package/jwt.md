下面我给你写一个 **从零开始、最清晰、最完整、最实用** 的 Node.js + JWT 教程。

包括：

* ⭐ JWT 是什么、怎么工作
* ⭐ 最基础的 JWT 使用（登录生成 token）
* ⭐ Express 中实现 JWT 鉴权中间件
* ⭐ Token 过期、刷新、黑名单
* ⭐ 更安全的做法（进阶）
* ⭐ 完整可运行的项目代码

这是你未来做登录、鉴权 **必学的核心知识**。

---

# 🎯 一、JWT 是什么？

JWT 全称 **JSON Web Token**，用于：

* **用户登录后颁发令牌**
* **前端带着令牌访问接口**
* **后端验证令牌是否有效**

**JWT 不需要 session，不需要存服务器**
→ 前端和服务端都可以验证，非常适合前后端分离项目。

---

# 🎯 二、JWT 长什么样？

一个 JWT 由三部分组成：

```
header.payload.signature
```

例如：

```
eyJhbGciOiJIUzI1NiJ9
.
eyJ1c2VySWQiOjEyMywidXNlcm5hbWUiOiJ3eiJ9
.
O2R3s8mxfjn3D...（签名）
```

---

# 🎯 三、JWT 在系统中的流程（必须理解）

```
用户登录 → 后端验证成功 → 颁发 JWT token
         ↓
   前端本地存 token（localStorage / cookie）
         ↓
前端每次访问接口 -> 携带 token
         ↓
      后端验证 token
         ↓
       放行 / 拒绝
```

---

# ⭐ 四、Node.js 安装 JWT

```bash
npm install jsonwebtoken
```

Express 常见组合：

```bash
npm install express jsonwebtoken
```

---

# ******************************************************************

# ⭐⭐⭐ 五、最最基础的 JWT 使用（登录生成 token）

# ******************************************************************

新建一个文件：`jwt-basic.js`

```js
const jwt = require('jsonwebtoken');

const secret = "MY_SECRET_KEY";  // 自己定义

// 模拟用户登录
const user = {
  id: 1,
  username: "wx"
};

// 生成 token（最基本）
const token = jwt.sign(user, secret);

console.log("生成的token：", token);
```

运行：

```bash
node jwt-basic.js
```

你会看到一个长长的 token。

---

# 🎯 六、给 token 加上过期时间（非常重要）

```js
const token = jwt.sign(user, secret, { expiresIn: "2h" });
```

常用写法：

| 设置   | 写法     |
| ---- | ------ |
| 2 小时 | `"2h"` |
| 7 天  | `"7d"` |
| 60 秒 | `60`   |

---

# ******************************************************************

# ⭐⭐⭐ 七、Express 项目：登录生成 token（最常用）

# ******************************************************************

创建一个可直接运行的 Express 项目：

```js
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const SECRET = "MY_SECRET_KEY";

// 📌 1. 登录接口：验证成功 -> 发 token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // 简化：只要 username 存在就让登录
  if (!username) {
    return res.status(400).json({ msg: "用户名不能为空" });
  }

  // payload 中可以放用户信息
  const payload = {
    id: 1,
    username
  };

  // 生成 token
  const token = jwt.sign(payload, SECRET, { expiresIn: "2h" });

  res.json({
    msg: "登录成功",
    token
  });
});

// 📌 2. 启动服务
app.listen(3000, () => console.log("Server running at 3000"));
```

---

# ******************************************************************

# ⭐⭐⭐ 八、编写 JWT 鉴权中间件（重点）

# ******************************************************************

新建一个中间件：`auth.js`

```js
const jwt = require('jsonwebtoken');

const SECRET = "MY_SECRET_KEY";

function auth(req, res, next) {
  // 从请求头获取 token
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: "没有提供token" });
  }

  // 验证 token
  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ msg: "token 无效或已过期" });
    }

    req.user = user; // 保存解码后的用户信息
    next();
  });
}

module.exports = auth;
```

---

# ******************************************************************

# ⭐⭐⭐ 九、在 Express 中使用 JWT 鉴权保护接口（非常常用）

# ******************************************************************

修改 `server.js`

```js
const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('./auth');

const app = express();
app.use(express.json());

app.get('/profile', auth, (req, res) => {
  res.json({
    msg: "用户信息获取成功",
    user: req.user
  });
});

app.listen(3000);
```

测试：

* 没 token → ❌ 401
* token 错误 → ❌ 401
* token 正确 → ✔ 返回用户信息

---

# ******************************************************************

# ⭐⭐⭐ 十、进阶：刷新 token（Refresh Token）

# ******************************************************************

为什么需要 Refresh Token？

因为：

1. Access Token（JWT）有效期不能太长（比如 2 小时）
2. 用户不希望频繁登录

解决方案：

* 登录时给两个 token

  1. access token：2 小时
  2. refresh token：7 天

刷新逻辑：

```
access token 过期
→ 前端用 refresh token 调用 /refresh
→ 后端签发新的 access token
```

简单示例：

```js
app.post("/refresh", (req, res) => {
  const refreshToken = req.body.token;

  jwt.verify(refreshToken, SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: "refresh token失效" });

    const newToken = jwt.sign({ id: user.id }, SECRET, { expiresIn: "2h" });

    res.json({ token: newToken });
  });
});
```

---

# ******************************************************************

# ⭐⭐⭐ 十一、进阶：Logout（黑名单机制）

# ******************************************************************

JWT 无法主动失效，所以登出一般做：

* 将 token 存到黑名单（数据库 / Redis）
* 请求时判断 token 是否在黑名单

简化案例：

```js
let blacklist = [];

app.post('/logout', auth, (req, res) => {
  blacklist.push(req.headers.authorization.split(" ")[1]);
  res.json({ msg: "退出成功" });
});
```

在 auth 中判断：

```js
if (blacklist.includes(token)) {
  return res.status(401).json({ msg: "token 已登出" });
}
```

---

# ******************************************************************

# ⭐⭐⭐ 十二、JWT 使用最佳实践（企业级）

# ******************************************************************

✔ token 放在前端 **localStorage** 或 **bearer token**
✔ access token 有效期短（1h~2h）
✔ refresh token 有效期长（7d ~ 30d）
✔ 敏感接口必须加 JWT 中间件
✔ 退出登录要加入黑名单机制
✔ 用户信息不能放敏感数据

---

# ⭐ 需要完整项目结构吗？

我可以给你生成：

* 项目目录结构
* JWT 鉴权 + 用户登录
* 上传头像 + JWT 鉴权
* 用户资料接口（需要登录）
* MongoDB/MySQL 的用户数据库
* 前端 Vue/React 的登录 token 处理逻辑

你想要哪种版本？
