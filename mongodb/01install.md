

# ✅ **解决方案 1（推荐）：手动下载 ZIP 版（无 GUI）**

MongoDB 官方提供 **ZIP 免安装版**，你无需 GUI，也无需安装任何可视化工具。

## ✔ 步骤：

### **① 下载 ZIP 包（无安装）**

官网下载：
👉 [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

选择：

* Version：**8.0 或 7.0**（推荐 7.0 更稳定）
* OS：Windows
* Package：**ZIP (Not MSI)**

下载约 300 MB。

---

### **② 解压 ZIP 到一个目录**

例如：

```
C:\MongoDB\
```

解压后会有：

```
C:\MongoDB\bin\
```

---

### **③ 创建数据库目录 (必须)**

MongoDB 默认使用：

```
C:\data\db
```

你需要自己创建：

```
mkdir C:\data
mkdir C:\data\db
```

---

### **④ 启动 MongoDB**

直接运行：

```
C:\MongoDB\bin\mongod.exe
```

MongoDB 就启动成功了。

---

### **⑤（可选）加入 PATH**

把 `C:\MongoDB\bin` 加入 PATH，命令行直接使用 `mongod` 和 `mongo`。

---

# 🚫 **你真的不用用 Studio 3T，也不用 Compass GUI！**

ZIP 版包含：

* mongod（服务端）
* mongosh（MongoDB Shell）
* mongotools（备份工具）

完全够用了。

---

# ✅ **解决方案 2：继续使用 Chocolatey（不推荐）**

Chocolatey 现在的 MongoDB 包经常失效，如果一定要用：

试试安装旧版本：

```
choco install mongodb --version=7.0.12
```

或：

```
choco install mongodb --pre
```

但不能保证成功。

---

# 🧨 **你刚才的安装失败不影响系统，可以放心**

你只是下载失败，MongoDB 并没有安装过，所以没有残留问题。

---

# 

看你的日志，**mongod 已经成功启动**了，只不过你现在是在 **前台模式**运行它（也就是命令行被占着）。
Studio 3T 之所以 **一直连接失败、按钮灰色**，通常是因为：

---

# ✅ **你现在遇到的问题：mongod 占用了命令行，Studio 3T 无法连接**

你运行了：

```
mongod
```

这会启动 MongoDB **服务器端（后台数据库）**，并且**占据当前终端窗口**。
这时 Studio 3T 要连上 MongoDB，必须满足：

## ✔ 1. MongoDB **正在运行**

✔ 2. MongoDB **监听在本地 27017 端口**
✔ 3. 你没有把 `dbPath` 搞错
✔ 4. 你没有开“认证模式”（没有的话简单很多）

但你现在的问题是：

---

# ❗ **你打开 Studio 3T 创建连接时，没有真正连上本地数据库**

Studio 3T 默认会尝试连接：

```
mongodb://localhost:27017
```

如果连接失败，它的 **OK 按钮始终是灰色的**。

---

# 🚀 **解决方法**

## **✔ 方法 1：手动指定 dbPath，重新启动 mongod**

你现在是 *直接* 运行 `mongod`，但 Windows 上必须要有 **数据目录** 才能正常运行 MongoDB。

默认位置一般没有自动创建，会报隐藏错误。

### 👉 正确启动方法：

先创建数据目录：

```
mkdir C:\data\db
```

然后启动：

```
mongod --dbpath C:\data\db
```

如果看到这些表示成功：

* `Waiting for connections…`
* `port: 27017`

然后你可以再去 Studio 3T 点击连接。

---

## **✔ 方法 2：使用“服务模式”启动（推荐，后台自动运行）**

如果你是用 MSI 安装 MongoDB，它会自动安装为 Windows 服务：

你可以试试运行：

```
net start MongoDB
```

如果出现：

```
The MongoDB service is starting.
The MongoDB service was started successfully.
```

说明后台服务启动成功，这样你不需要手动开 `mongod`，Studio 3T 也能自动连接。

---

## **✔ 方法 3：检查端口是否真的开启**

运行：

```
netstat -ano | findstr 27017
```

如果没有输出 → MongoDB 没启动成功。
如果有类似：

```
TCP    127.0.0.1:27017    LISTENING
```

那么你可以在 Studio 3T 连接。

---

# 🔍 **Studio 3T 正确的连接方式**

打开 Studio 3T → 点击：

```
New Connection
```

然后填：

```
mongodb://127.0.0.1:27017
```

然后点 **Test Connection**
如果显示：

```
Successfully connected
```

按钮就会亮，连接即可完成。

---

# ❓为了快速判断问题，请给我两条信息：

请你在命令行依次执行，并把输出发我：

### ① `net start MongoDB`

检查服务是否存在。

### ② `netstat -ano | findstr 27017`

检查 MongoDB 是否在监听端口。

---

我可以帮你一步步让 Studio 3T 成功连接本地 MongoDB。

# 
好的，那我们就按照 **方法 1** 用你自己的 MongoDB 目录（`D:\mongodb\bin`）正确启动 MongoDB。

你只需要做 **三步** 就能成功启动并连接 Studio 3T。

---

# ✅ 第一步：创建 MongoDB 的数据目录（必须）

在命令行执行：

```
mkdir D:\mongodb\data\db
```

或者你想用其他位置也可以，只要目录存在即可。

⚠ **注意：dbPath 必须是空文件夹，并且必须存在。**

---

# ✅ 第二步：正确启动 mongod（指定 dbPath）

进入你的 bin 目录：

```
cd D:\mongodb\bin
```

然后运行：

```
mongod --dbpath D:\mongodb\data\db
```

如果你看到：

```
Waiting for connections...
Listening on port 27017
```

说明 **MongoDB 服务器启动成功**。

⚠ 此窗口要保持**一直开着**，否则数据库会关掉。

---

# ✅ 第三步：Studio 3T 设置连接

打开 Studio 3T → New Connection → 填写：

```
mongodb://127.0.0.1:27017
```

然后点：

```
Test Connection
```

如果成功，会显示：

```
Successfully connected
```

然后 OK 按钮就会亮了。

---

# 🔍 如果你运行 `mongod` 后没有显示成功信息？

请告诉我 **启动日志的最后几行**，我帮你排查。

---

要不要我帮你写一个自动启动脚本，让你以后双击就能启动 MongoDB？

