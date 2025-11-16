下面给你讲解 **Node.js 中 bcrypt 的使用**，从最基础到进阶实战，结合经典项目场景（如用户注册 + 登录密码加密对比）。

---

# 🔰 1️⃣ bcrypt 是什么？为什么要用它？

用于 **密码加密存储** 的库
✔ 单向加密（不可逆）
✔ 自动加盐（salt）防止彩虹表攻击
✔ 安全性强

---

# 📦 2️⃣ 安装 bcrypt

```bash
npm install bcrypt
```

或如果 Windows 编译失败可使用：

```bash
npm install bcryptjs
```

（同样 API，但纯 JS 性能略低）

---

# 🧂 3️⃣ 基础用法：加盐 🔁 哈希

```js
const bcrypt = require("bcrypt");

const password = "mySecret123";
const saltRounds = 10; // 加盐强度

bcrypt.hash(password, saltRounds, (err, hash) => {
  console.log("加密后的密码：", hash);
});
```

输出类似：

```
$2b$10$uLsFTypGrQzty....
```

> Salt 自动内嵌在 hash 字符串中，无需单独保存。

---

# 🔍 4️⃣ 登录验证：密码对比

```js
const bcrypt = require("bcrypt");

const password = "mySecret123"; // 用户输入的
const hashedPassword = "$2b$10$xxxxxx...."; // 数据库中存的

bcrypt.compare(password, hashedPassword, (err, result) => {
  if (result) {
    console.log("密码正确，登录成功");
  } else {
    console.log("密码错误！");
  }
});
```

✔ 你不需要自己提取盐
✔ compare 会自动检查盐并比对哈希

---

# ⚡ 推荐使用 Promise + async/await（进阶写法）

```js
const bcrypt = require("bcrypt");

async function encrypt() {
  const password = "abc123";
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

encrypt();
```

对比密码：

```js
async function check(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

---

# 🏗️ 5️⃣ Express + MongoDB 用户注册与登录实战

下面是你项目中常用的！

## ⭐ 用户注册（保存加密密码）

```js
const bcrypt = require("bcrypt");
const User = require("./models/User");

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await User.create({ username, password: hash });

  res.json({ message: "注册成功" });
});
```

---

## ⭐ 用户登录（对比密码）

```js
const bcrypt = require("bcrypt");
const User = require("./models/User");

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
 
  if (!user) return res.status(400).json({ msg: "用户不存在" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ msg: "密码错误" });

  res.json({ msg: "登录成功" });
});
```

---

# 🔱 6️⃣ 加盐轮数建议（安全 vs 性能）

| saltRounds | 安全性   | 性能   | 建议场景       |
| ---------- | ----- | ---- | ---------- |
| 8          | ⭐⭐⭐   | ⚡⚡⚡⚡ | 本地开发 / 测试  |
| **10（默认）** | ⭐⭐⭐⭐  | ⚡⚡⚡  | ✔ 推荐（生产环境） |
| 12+        | ⭐⭐⭐⭐⭐ | ⚡⚡   | 高安全需求      |

---

# 🔥 7️⃣ bcrypt 与 bcryptjs 选择

| 库          | 实现     | 性能 | 安全性                |
| ---------- | ------ | -- | ------------------ |
| **bcrypt** | C++ 扩展 | 更快 | 更推荐                |
| bcryptjs   | 纯 JS   | 稍慢 | 适合 Windows 安装失败时替代 |

建议优先使用 **bcrypt**

---

# 🧠 8️⃣ 常见问题与最佳实践

| 问题                | 解决方法                |
| ----------------- | ------------------- |
| 密码明文存数据库？         | ❌ 永远不要              |
| Salt 需要单独存？       | ❌ 已包含在 hash 内       |
| 用户改密码怎么办？         | 重新 hash 后再保存        |
| compare 总是 false？ | 检查 password、hash、编码 |
| bcrypt.hashSync?  | ❌ 不推荐，会阻塞 Node      |

---

# 🎯 9️⃣ 完整项目密码存储流程总结

```
注册：
   明文密码 -> bcrypt hash -> 存储到 DB

登录：
   用户输入密码 -> bcrypt.compare -> 返回 token
```

✔ 从未直接存储明文密码
✔ 安全防止泄露风险

---

如果你需要，我可以给你：

💡 JWT 登录 + bcrypt 密码加密
💡 React 前端存 Token
⚡️ MongoDB 用户模型
🚀 一套完整可运行的用户认证系统模板

你要我给你完整项目吗？我可以一步步带你搭建。
