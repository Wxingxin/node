
# Node.js 到底是什么（通俗版）

* **Node.js = JavaScript + 在服务器/命令行跑的运行时环境**。它把浏览器里的 JS（由 V8 引擎执行）拿到服务器上运行，并提供操作文件、网络、子进程等能力。
* 关键三件套：

  * **V8**：Google 的 JS 引擎，负责执行 JS 代码。
  * **libuv**：实现事件循环、线程池、异步 I/O 的 C 库（让 JS 能做文件/网络等异步操作）。
  * **Node 核心模块**：提供 `fs`、`http`、`net`、`child_process` 等底层功能。
* **单线程 + 异步 I/O**：Node 的 JS 执行在单个线程（事件循环）上，但可以通过异步 I/O 与线程池/内核并发处理大量请求，适合 I/O 密集型场景（web 服务、API、文件操作等）。

# 核心概念（必须懂）

1. **事件循环（Event Loop）**：理解宏任务/微任务队列（setTimeout、Promise.then）的执行顺序，能解释为什么同步阻塞会卡死整个进程。
2. **回调、Promise、async/await**：掌握从回调地狱 → Promise 链 → async/await 的写法和错误处理（try/catch / .catch）。
3. **模块系统**：

   * CommonJS (`require`, `module.exports`) — 传统 Node 模块。
   * ES Modules (`import`, `export`) — 新标准，注意 package.json 的 `"type": "module"`。
4. **npm / package.json**：依赖管理、scripts、semver、devDependencies vs dependencies。
5. **核心模块**：`fs`, `path`, `http`, `https`, `crypto`, `stream`, `buffer`, `child_process`。
6. **Streams（流）**：处理大文件、实时数据流（Readable/Writable/Transform）。
7. **Buffer**：二进制数据处理（文件、网络数据、加密）。
8. **错误处理 & 异常**：同步/异步错误处理不同点，未捕获异常会导致进程崩溃。
9. **性能 & 扩展性**：

   * 负载高时用 cluster 或子进程（多核）。
   * 使用负载均衡（nginx）部署多实例。
10. **安全**：不信任用户输入、避免命令注入、管理依赖漏洞、使用 helmet 等中间件（Express 场景）。

# 必备工具 & 开发流程习惯

* **node + npm / pnpm / yarn**（推荐使用 `nvm` 管理 Node 版本）
* `nodemon`（开发自动重启）
* `eslint` + `prettier`（代码风格）
* 调试：VSCode 的 Node 调试器、`console`、`node --inspect` / Chrome DevTools
* 测试：`jest` / `mocha` + `supertest`
* 打包/构建（若用 TypeScript）：`tsc`、`esbuild`、`webpack`（简单了解）
* 容器化（进阶）：Docker

# 学习路线：0 → 可上手（12 周建议）

下面是一个详细周计划（每周目标 + 推荐练习）。如果你每天能投入 1–2 小时，12 周能得到很扎实的基础；想更快可以压缩到 6–8 周。

## 第 1 周：环境与基础回顾（目标：能运行 Node 程序）

* 内容：

  * 安装 Node（使用 nvm），学会 `node`、`npm`、`npx`。
  * 认识 `package.json`、`node_modules`。
  * 运行 `.js` 文件：`node index.js`。
* 练习：

  * 写一个 `hello.js` 打印、接受命令行参数（`process.argv`）。
  * 在 package.json 加 script：`"start": "node index.js"`。

## 第 2 周：模块与文件系统（目标：熟练使用模块、fs）

* 内容：

  * CommonJS 模块（exports/require），以及 ESM（import/export）。
  * `fs` 的同步/异步 API，路径处理 `path`。
* 练习：

  * 写脚本遍历一个文件夹，统计每种扩展名的文件数量并输出 JSON。
  * 实现命令行小工具（使用 `process.argv` 解析参数）。


## 第 4 周：HTTP 与 Web 服务器（目标：能用 http 模块和 Express 建站）

* 内容：

  * 原生 `http` 模块：创建简单服务器，路由、请求/响应、静态文件。
  * 引入 Express：中间件、路由、请求体解析、静态文件、错误处理中间件。
* 练习：

  * 用原生 `http` 写一个简单路由（/、/about）。
  * 用 Express 做一个简单的 TODO API（CRUD，内存存储即可）。

## 第 5 周：数据库 & 持久化（目标：能连接并操作数据库）

* 内容：

  * 关系型（MySQL/Postgres）或 NoSQL（MongoDB）基础。选择一个开始（很多人先学 MongoDB）。
  * 使用 ORM/ODM：Mongoose（Mongo）、Prisma 或 Sequelize（SQL）。
* 练习：

  * 把 TODO API 持久化到 MongoDB（使用 Mongoose）。
  * 学会连接字符串、环境变量管理（`.env` 与 `dotenv`）。

## 第 6 周：认证、授权与文件上传（目标：实现用户登录和文件上传）

* 内容：

  * JWT（Json Web Token）认证流程、session 与 cookie（基础）。
  * 文件上传（multer）和保存到本地/外部服务（S3 概念）。
* 练习：

  * 为 API 加登录（注册/登录/守护路由）。
  * 实现头像上传并显示。

## 第 7 周：高级 Node API（目标：熟悉流、Buffer、子进程）

* 内容：

  * Streams（Readable/Writable/Transform）— 大文件处理、管道。
  * Buffer 操作（编码/解码）。
  * `child_process`（spawn、exec）、`worker_threads`（多线程计算场景）。
* 练习：

  * 写一个用 stream 读取 CSV 并逐行处理的脚本（防止内存撑爆）。
  * 使用 child_process 调用外部命令（例如 `ffmpeg` 的简单封装）。

## 第 8 周：测试、调试与重构（目标：写测试，能调试）

* 内容：

  * 单元测试与集成测试（Jest / Mocha + Supertest）。
  * 使用 VSCode 断点调试、`node --inspect`。
* 练习：

  * 为之前的 TODO API 写若干测试。
  * 用断点调试一个 bug，并记录调试过程。

## 第 9 周：TypeScript（可选，但强烈推荐）或 继续加固 JS 基础

* 内容：

  * TypeScript 基础（类型、接口、泛型、tsconfig）。
  * 在 Node/Express 中使用 TypeScript。
* 练习：

  * 把一个小服务迁移到 TypeScript。

## 第 10 周：部署与运维基础（目标：能把服务发布到线上）

* 内容：

  * PM2 / systemd 管理进程，基本日志管理。
  * Docker 容器化（Dockerfile、镜像、容器运行）。
  * 部署到 VPS 或云（Netlify/Heroku/Vercel 对于 Node 后端，Heroku 或自建 VPS 更常见）。
* 练习：

  * 写 Dockerfile，把小服务容器化并在本地跑一遍。
  * 用 PM2 启动生产进程。

## 第 11 周：安全、性能优化（目标：写更健壮的服务）

* 内容：

  * 常见安全问题（XSS、CSRF、SQL/NoSQL 注入、命令注入）。
  * 性能监控、日志（winston 或 pino）、A/B 压测基础（autocannon）。
* 练习：

  * 用 helmet、rate-limit 等中间件加固 API。
  * 用 autocannon 做简单压力测试并阅读结果。

## 第 12 周：整合项目 + 面试题复习（目标：完成一个可部署项目）

* 内容：

  * 完成一个小型完整项目并部署（例如博客、任务管理、文件分享）。
  * 复习面试高频点（事件循环、promise、流、模块、数据库连接池、缓存策略）。
* 练习：

  * 项目上线并发 invite 给朋友试用，记录 bug 并修复。

# 项目建议（从易到难）

1. 命令行工具：例如文件批量重命名/打包工具。
2. TODO API（Express + Mongo/MariaDB）。
3. 博客系统：带用户登录、文章 CRUD、图片上传、分页。
4. 文件分享服务：上传/下载、断点续传（使用 streams）。
5. 实时聊天室：Socket.io 实现（WebSocket）。
6. 爬虫 + 数据处理：用 `axios`/`node-fetch` + cheerio 做数据抓取并保存结果。

# 常见命令 & package.json 小抄

* 初始化：`npm init -y`
* 安装依赖：`npm i express mongoose`
* 开发依赖：`npm i -D nodemon eslint`
* 运行脚本：

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js",
  "test": "jest"
}
```

* 运行：`npm run dev`

# 关键代码示例（最基础：Express + MongoDB 的小 API）

```js
// index.js
import express from 'express'; // 如果用 CommonJS: const express = require('express')
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {});

const TodoSchema = new mongoose.Schema({ text: String, done: Boolean });
const Todo = mongoose.model('Todo', TodoSchema);

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const t = await Todo.create({ text: req.body.text, done: false });
  res.status(201).json(t);
});

app.listen(3000, () => console.log('Server listening on 3000'));
```

# 面试高频题（你应该会回答）

* 解释 Node 的事件循环是什么？宏任务/微任务差别？
* CommonJS 与 ESM 有什么区别？
* 如何处理大量并发请求？（负载均衡、cluster、多进程）
* Streams 是什么？与 Buffer 有何关系？
* 描述一次 HTTP 请求从到达到响应的流程（在 Express/Node 环境下）。
* 如何查找和修复内存泄漏？

# 学习技巧 & 陷阱

* 从小项目开始：先实现能工作的、然后逐步加复杂性（数据库、认证、文件）。
* 多写单元/集成测试：能让你快速发现接口问题和回归。
* 理解异步（而不是死记 API）：事件循环、Promise、错误传播是根基。
* 别一开始就追求 “框架化” —— 先用原生 http + Express 理解 HTTP 请求处理，再学 Nest.js 之类的框架。
* 养成使用 `.env` 管理密钥的习惯，不要把秘密放到代码库。

# 推荐资源（中文/英文混合）

（入门看官方文档 + 实战为主）

* Node.js 官方文档（API）
* Express 官方文档
* MDN（对 JS 的复习）
* 实战教程/项目驱动课程（选择你熟悉的平台）
* 书：深入浅出 Node.js（类似书籍）或线上课程（项目驱动）

---

如果你愿意，我可以立刻为你做下面任意一项（选一项我就直接开始，不用你再回答任何问题）：

1. 给你 **7 天每日学习计划**（每天任务 + 代码练习和提交清单）。
2. 帮你搭建一个 **Todo API 的完整代码仓库结构**（包含 ESLint、nodemon、Dockerfile、测试示例）。
3. 为你出一份 **面试题清单 + 答案解析（带代码示例）**，覆盖 Node 常见题目。

你想要哪一项？（直接回复 1、2 或 3，我马上给出完整内容）
