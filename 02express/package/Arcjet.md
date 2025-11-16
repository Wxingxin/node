下面我给你 **Arcjet（arcjet/node）在 Node.js 中从最最基础到进阶的完整使用教程**，结合常见的 Express 项目，讲到你能马上用在自己的后端项目里。

---

# ⭐ Arcjet 是什么？

Arcjet 是一个 **API 安全与防护服务**，专门保护你的 Node/Express 后端。
主要功能包括：

✔ **Rate Limit（限流）** — 防止接口被恶意刷爆
✔ **Bot Detection（机器人检测）** — 阻止爬虫或攻击脚本
✔ **Email Verification（邮箱校验）** — 快速判断注册邮箱是否真实
✔ **IP Reputation（IP 信誉检测）** — 自动识别恶意 IP
✔ **防 DDOS、自动封锁可疑请求**

Arcjet 提供官方包：

```
arcjet/node
```

专门用于 Node.js 后端。

---

# 📦 1. 最基础：安装与初始化（必须）

```bash
npm install arcjet
```

创建一个 Arcjet 客户端（可以放在 `arcjet.js` 文件中）：

```js
// arcjet.js
import Arcjet from "arcjet";

export const aj = Arcjet({
  key: process.env.ARCJET_KEY, // 你在 Arcjet Dashboard 获取
  features: [],
});
```

然后在 `.env` 中放：

```
ARCJET_KEY=aj_live_****
```

---

# 📌 2. Express 最基础使用（阻止恶意请求）

Arcjet 的 Express 中间件写法：

```js
// app.js
import express from "express";
import { aj } from "./arcjet.js";

const app = express();

app.use(async (req, res, next) => {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    return res.status(429).json({ message: "Too many requests or suspicious traffic" });
  }

  next();
});

app.listen(3000);
```

这样 Arcjet 就会对每个请求做 AI 分析，判断是否恶意。

---

# 🔥 3. 启用基础 Rate Limit（限流）

比如每个 IP **每分钟最多 10 次**：

```js
export const aj = Arcjet({
  key: process.env.ARCJET_KEY,
  features: [
    Arcjet.rateLimit({
      mode: "live",
      max: 10,
      interval: "1m",
    })
  ],
});
```

效果：

* 超过 10 次 → Arcjet 自动阻止
* 不需要手写任何计数器

---

# 🔥 4. 进阶：对某个接口单独限流

比如 `/login` 只允许 5 次尝试：

```js
app.post("/login", async (req, res, next) => {
  const decision = await aj.with(
    Arcjet.rateLimit({ max: 5, interval: "1h", mode: "live" })
  ).protect(req);

  if (decision.isDenied()) {
    return res.status(429).json({ message: "Too many login attempts" });
  }

  next();
});
```

---

# 🔥 5. Email 验证（判断注册邮箱是否真实、是否一次性邮箱）

Arcjet 能识别是否一次性邮箱：

```js
import Arcjet from "arcjet";

export const aj = Arcjet({
  key: process.env.ARCJET_KEY,
  features: [
    Arcjet.email()
  ],
});
```

使用：

```js
app.post("/register", async (req, res) => {
  const { email } = req.body;

  const result = await aj.email(email);

  if (result.isDisposable()) {
    return res.status(400).json({ message: "Disposable email not allowed" });
  }

  res.json({ message: "OK" });
});
```

---

# 🔥 6. Bot Detection（检测机器人、不良脚本）

你可以给某些接口添加 Bot 检测：

```js
app.post("/search", async (req, res, next) => {
  const decision = await aj.with(
    Arcjet.bot()
  ).protect(req);

  if (decision.isDenied()) {
    return res.status(403).json({ message: "Bots not allowed" });
  }

  next();
});
```

---

# 🔥 7. IP 信誉检测（自动拦截恶意 IP）

Arcjet 会检查：

* 是否来自已知攻击来源
* 是否为 TOR 或 VPN
* 是否是爬虫服务器

```js
export const aj = Arcjet({
  key: process.env.ARCJET_KEY,
  features: [
    Arcjet.ipReputation()
  ]
});
```

---

# ⭐ 8. 高级功能：识别用户（User ID 限流）

如果你想按用户 ID 限流，而不是按 IP：

```js
app.post("/comment", async (req, res, next) => {
  const userId = req.user?.id || "anonymous";

  const decision = await aj.with(
    Arcjet.rateLimit({
      key: userId,
      max: 20,
      interval: "1h",
    })
  ).protect(req);

  if (decision.isDenied()) {
    return res.status(429).json({ message: "Too many comments" });
  }

  next();
});
```

---

# 🔥 9. 完整进阶 Express 示例（限流 + Bot + IP信誉）

```js
import express from "express";
import Arcjet from "arcjet";

const aj = Arcjet({
  key: process.env.ARCJET_KEY,
  features: [
    Arcjet.rateLimit({ max: 100, interval: "1h", mode: "live" }),
    Arcjet.bot(),
    Arcjet.ipReputation()
  ],
});

const app = express();

app.use(express.json());

// 全局保护
app.use(async (req, res, next) => {
  const result = await aj.protect(req);

  if (result.isDenied()) {
    return res.status(403).json({ message: "Forbidden by Arcjet" });
  }

  next();
});

// 单独为某个接口增加更严格的保护
app.post("/login", async (req, res, next) => {
  const decision = await aj.with(
    Arcjet.rateLimit({ max: 5, interval: "1h", mode: "live" }),
    Arcjet.bot()
  ).protect(req);

  if (decision.isDenied()) {
    return res.status(429).json({ message: "Too many login attempts" });
  }

  // 登录逻辑...
  res.json({ message: "Login success" });
});

app.listen(3000, () => console.log("Server running"));
```

---

# 📌 10. Arcjet 为什么越来越流行？

因为它是：

✔ 更强的安全（自动识别攻击者）
✔ 比手写 rate-limit 更准确
✔ 不需要 Redis、Mongo 来保存计数器
✔ 不需要折腾复杂的安全策略
✔ 免费计划已经够个人项目用了

它是一个 **智能安全层**，你只用几行代码就能保护整个 API。

---

# ⭐ 想要我帮你把 Arcjet + JWT + 登录系统整合吗？

我可以给你写一个 **完整登录注册系统（含限流、邮箱检测、IP 信誉、机器人防护）** 的 Express 项目。
