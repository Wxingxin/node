下面给你讲解 **React 前端如何接收 Node（Express）返回的 JWT Token，并安全存储在 localStorage 或 sessionStorage**，从基础到进阶，包含经典案例代码。

---

# ✅ **1. Node（Express）端：返回 Token**

假设登录接口如下：

```js
// /routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 简化：这里假装登录成功
  const token = jwt.sign(
    { username },
    "MY_SECRET_KEY", // 你自己的密钥
    { expiresIn: "2h" }
  );

  res.json({
    message: "login success",
    token
  });
});

module.exports = router;
```

注意：返回 JSON（包含 token 字段）。

---

# ✅ **2. React 前端：接收 Token**

你一般会使用 `fetch` 或 `axios`。

## **使用 fetch 示例**

```js
const handleLogin = async () => {
  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  const data = await res.json();

  // data.token 就是 Express 返回的 JWT
  console.log("token:", data.token);

  // 存储
  localStorage.setItem("token", data.token); // 也可以 sessionStorage
};
```

---

# 🟦 **localStorage vs sessionStorage**

| 存储方式               | 生命周期    | 刷新后是否保存 | 适用场景       |
| ------------------ | ------- | ------- | ---------- |
| **localStorage**   | 永久      | ✔ 保留    | 用户长期登录     |
| **sessionStorage** | 关闭标签页消失 | ❌ 不保留   | 用户每次必须重新登录 |

常见做法：**localStorage 存 token**。

---

# ✅ **3. React 在每次请求时自动带上 Token**

例如你访问一个“需要登录”的接口 `/user/profile`，就要带上 Authorization：

```js
const token = localStorage.getItem("token");

const res = await fetch("http://localhost:3000/user/profile", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

后台 Express 中间件解析 token：

```js
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, "MY_SECRET_KEY", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; // 保存 token 中的数据
    next();
  });
}

module.exports = authMiddleware;
```

---

# ⚡ **4. React 项目登录完整示例（非常经典）**

### 登录组件（Login.jsx）

```jsx
import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);  // 存储 token
      alert("Login success!");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div>
      <input 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username" 
      />

      <input 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        type="password"
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
```

---

# 🔥 **5. React 使用 Token 访问受保护 API（带 token 自动请求）**

```js
async function fetchProfile() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/user/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  console.log(data);
}
```

---

# ⭐ **6. 建议使用 axios 封装 Token 拦截器（进阶）**

一点即可：

```js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000"
});

// 请求拦截器 —— 自动带上 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

然后你在 React 中使用：

```js
const res = await api.get("/user/profile");
console.log(res.data);
```

现在全项目都自动使用 Token，超级方便。

---

# 🧠 **7. Token 存储安全建议**

| 存储方式                | 安全性       | 是否推荐      |
| ------------------- | --------- | --------- |
| localStorage        | 易被 XSS 读取 | ❌ 最终不推荐   |
| sessionStorage      | 同上        | ❌ 不推荐     |
| **HttpOnly Cookie** | JS 不能读取   | ✔ 推荐（最安全） |

你目前学习阶段用 `localStorage` 就够了。

如果你想要 **HttpOnly + Secure 的真正安全 JWT 登录方案**，我也能教你（稍高阶）。

---

# 📌 如果你愿意，我可以给你一个完整的：

✅ 前端 React + axios + Token 拦截器
✅ 后端 Express + JWT 登录
⚡ **完整项目代码模板（直接能跑）**

你需要吗？
