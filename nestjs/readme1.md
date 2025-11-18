

## 一、安装 & 查看帮助

```bash
npm i -g @nestjs/cli
# 或者
pnpm add -g @nestjs/cli
# 或者
yarn global add @nestjs/cli
```

```bash
nest -h        # 总帮助
nest new -h    # 某个子命令的帮助
```

---

## 二、项目创建相关

### ⭐ `nest new` – 创建新项目（最常用）

```bash
nest new my-app
```

常见参数：

```bash
nest new my-app -p npm      # 指定使用 npm
nest new my-app -p pnpm     # 指定使用 pnpm
nest new my-app -p yarn     # 指定使用 yarn
nest new my-app --skip-git  # 不初始化 git
nest new my-app --directory ./backend  # 指定生成目录
```

---

## 三、代码生成（generate / g）——真正提高效率的部分

> 💡 核心记忆：**“一个业务 = 一个模块 + controller + service + dto”**
> 基本都靠 `nest g` 帮你生成。

### ⭐ 通用形式

```bash
nest g <schematic> <name>
# schematic 就是你要生成的“类型”
```

---

### 1）⭐ 生成模块：`nest g module`

```bash
nest g module users
# 会生成 src/users/users.module.ts
```

---

### 2）⭐ 生成控制器：`nest g controller`

```bash
nest g controller users
# src/users/users.controller.ts
```

常用参数：

```bash
nest g controller users --flat    # 不新建目录，直接放在 src 下
nest g controller users --no-spec # 不生成测试文件
```

---

### 3）⭐ 生成服务：`nest g service`

```bash
nest g service users
# src/users/users.service.ts
```

同样可以：

```bash
nest g service users --no-spec
```

---

### 4）⭐ 一键生成完整 CRUD：`nest g resource`

> **强烈推荐，开发业务接口基本都用它**

```bash
nest g resource users
```

接下来 CLI 会问你几个问题：

* 选择 transport：REST API / GraphQL / Microservice …
* 是否生成 CRUD 代码：Yes
* 是否生成 DTO：Yes

最终帮你生成：

```text
src/users/
 ├── dto/
 ├── entities/
 ├── users.controller.ts
 ├── users.service.ts
 └── users.module.ts
```

---

### 5）其他常见 generate 类型（了解即可）

```bash
nest g class something             # 普通类
nest g interface something         # 接口
nest g pipe validation             # Pipe
nest g guard auth                  # Guard
nest g interceptor transform       # Interceptor
nest g filter http-exception       # Filter
nest g middleware logger           # Middleware
nest g gateway chat                # WebSocket Gateway
nest g module auth                 # Auth 模块
```

> 一般是：想到哪个概念，就 `nest g <概念> 名字` 试一下。

---

## 四、启动 / 构建 / 测试

> 这里有些是 `nest` 命令，有些是通过 `package.json` 的 script 跑的，习惯了就好。

### ⭐ 开发模式启动：`npm run start:dev`

最常用，不用直接敲 `nest`, 而是：

```bash
npm run start:dev      # 热更新开发模式
# 或
pnpm start:dev
yarn start:dev
```

对应 `package.json` 一般是：

```json
"scripts": {
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:prod": "node dist/main",
  ...
}
```

你也可以直接敲：

```bash
nest start --watch     # 等价于 start:dev
```

---

### ⭐ 构建项目：`nest build`

```bash
nest build             # 构建到 dist 目录
nest build users       # 构建特定项目（在 monorepo 时用）
```

生产环境跑的通常是：

```bash
npm run build
npm run start:prod
```

---

### ⭐ 测试相关（了解 + 偶尔用）

```bash
npm run test         # 单元测试
npm run test:watch   # 监听模式
npm run test:e2e     # e2e 测试
npm run test:cov     # 覆盖率
```

（这些都是脚手架帮你配好的 Jest）

---

## 五、项目工具类命令

### ⭐ `nest info` – 查看环境信息（排错时有用）

```bash
nest info
```

会显示：

* Nest 版本
* Node 版本
* npm/yarn 版本
* 相关依赖版本

---

### `nest update` – 更新 Nest 依赖（慎用，版本跨度大时需要看官方文档）

```bash
nest update
```

---

### `nest add` – 集成一些官方生态扩展（例如 swagger、graphql 等 schematics）

> 有些包集成时会给你提示可以用 `nest add xxx`，跟随官方说明用就行。

---

## 六、给你整理一个「日常开发常用命令清单」

**平时开发只要记住这些 ⭐ 部分就够用：**

1. **创建项目**

   ```bash
   nest new my-app
   ```

2. **开发启动**

   ```bash
   npm run start:dev
   ```

3. **生成模块 + 控制器 + 服务**

   ```bash
   nest g module users          # ⭐
   nest g controller users      # ⭐
   nest g service users         # ⭐
   ```

4. **一键生成 CRUD**

   ```bash
   nest g resource users        # ⭐ 强烈推荐
   ```

5. **生成配套功能类（按需用）**

   ```bash
   nest g guard auth            # 权限
   nest g pipe validation       # 参数验证
   nest g interceptor log       # 拦截器
   nest g middleware logger     # 中间件
   ```

6. **构建 & 生产环境**

   ```bash
   nest build
   npm run start:prod
   ```

7. **查看环境信息**

   ```bash
   nest info
   ```

---

## 七、给你一个「从 0 写一个 users 模块」的实际流程示例

假设你要新建 `users` 相关接口：

```bash
# 1. 新建资源（模块 + controller + service + dto 等全套）
nest g resource users

# 2. 启动项目开发
npm run start:dev

# 3. 在 users.service.ts 中写业务逻辑
# 4. 在 users.controller.ts 中设计接口路由
# 5. 在 dto/ 里改入参结构
```

基本上你以后每个“业务域”都可以按这套流程来。

---

如果你愿意，我可以：

* 帮你画一张 **「Nest CLI 命令脑图」**（用文字组织成学习路线）
* 或者给你做一个 **从 0 到能跑的完整 demo 项目命令步骤 + 代码模板**，你照抄就能跑。
