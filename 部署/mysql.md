非常棒 👍！
你现在已经把 **Node.js + MySQL 项目** 在本地全部跑通了，包括接口和表结构，下一步就是把它部署上线。

我会给你一个从 **0 到上线可访问** 的完整流程（适合小白），让你清楚每一步为什么要这样做 💡。

---

## 🚀 一、目标说明

最终你希望：

1. 你的后端（Node.js）在公网可访问。
2. 你的数据库（MySQL）在线运行，可以被 Node 连接。

我们要实现的最终效果是 👇：

```
浏览器 / 前端 → http://你的公网IP:3000/api
                           ↓
                    Node.js（Express）
                           ↓
                    MySQL（云服务器）
```

---

## 🧭 二、部署方式选择

你有两种方式可以选择：

| 方案                    | 说明                                         | 适合谁       |
| --------------------- | ------------------------------------------ | --------- |
| 🅰️ 自己买云服务器部署（推荐学习用）  | Node 和 MySQL 都装在同一台云服务器上                   | 想完整理解部署流程 |
| 🅱️ 使用云托管 + 云数据库（更简单） | Node 托管在 Render / Railway，数据库用 Cloud MySQL | 想快速上线、少配置 |

---

## 🧱 三、方案 A：在自己的云服务器上部署 Node + MySQL（推荐入门）

假设你已经买了一台 **Ubuntu 服务器**，我们一步步来 👇

---

### 🪜 第 1 步：连接服务器

用 SSH 登录你的云服务器：

```bash
ssh root@你的服务器IP
```

---

### 🪜 第 2 步：安装 Node 环境

```bash
sudo apt update
sudo apt install -y nodejs npm
node -v
npm -v
```

（可用 nvm 安装更新版本）

---

### 🪜 第 3 步：安装 MySQL

```bash
sudo apt install mysql-server -y
```

启动并设置开机自启：

```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

---

### 🪜 第 4 步：配置 MySQL 用户和数据库

进入 MySQL：

```bash
sudo mysql
```

创建用户、数据库、设置密码：

```sql
CREATE DATABASE myapp DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'myuser'@'%' IDENTIFIED BY 'mypassword';
GRANT ALL PRIVILEGES ON myapp.* TO 'myuser'@'%';
FLUSH PRIVILEGES;
EXIT;
```

💡 注意：
`'%'` 表示允许任何 IP 访问（测试阶段可以这样，上线后建议限制）。

---

### 🪜 第 5 步：修改配置文件允许远程访问

打开配置文件：

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

找到这一行：

```
bind-address = 127.0.0.1
```

改成：

```
bind-address = 0.0.0.0
```

保存退出（Ctrl+O 回车 Ctrl+X）

重启 MySQL：

```bash
sudo systemctl restart mysql
```

---

### 🪜 第 6 步：开放 3306 端口（MySQL 默认端口）

#### （1）安全组中添加规则

在云控制台 → 安全组 → 添加规则：

* 协议端口：`3306`
* 授权对象：`0.0.0.0/0`

#### （2）服务器内部防火墙放行

```bash
sudo ufw allow 3306
sudo ufw reload
```

---

### 🪜 第 7 步：上传你的 Node 项目

#### 方法一：使用 Git

```bash
git clone https://github.com/你的项目.git
cd 你的项目
npm install
```

#### 方法二：压缩上传

在本地压缩成 zip 上传：

```bash
scp myapp.zip root@你的服务器IP:/root/
unzip myapp.zip
```

---

### 🪜 第 8 步：修改数据库配置

在项目的 `.env` 或 `config.js` 中设置：

```env
DB_HOST=127.0.0.1
DB_USER=myuser
DB_PASS=mypassword
DB_NAME=myapp
PORT=3000
```

---

### 🪜 第 9 步：启动 Node 服务

测试运行：

```bash
node app.js
```

后台运行（推荐）：

```bash
npm install -g pm2
pm2 start app.js --name myapp
pm2 save
pm2 startup
```

---

### 🪜 第 10 步：开放 Node 端口

假设你的 Node 监听的是 3000 端口：

```bash
sudo ufw allow 3000
```

在云安全组中添加规则：

* 协议端口：3000
* 授权对象：0.0.0.0/0

---

### 🪜 第 11 步：浏览器访问

在浏览器输入：

```
http://你的服务器IP:3000
```

🎉 看到接口返回内容或页面，就表示上线成功！

---

## 🪶 四、方案 B：使用云托管（不想自己配置数据库）

| 平台                                     | 作用                |
| -------------------------------------- | ----------------- |
| [Render.com](https://render.com)       | 免费托管 Node 项目      |
| [Railway.app](https://railway.app)     | Node + MySQL 一起托管 |
| [PlanetScale](https://planetscale.com) | 免费 MySQL 云数据库     |

使用方式非常简单：

1. 注册账号并绑定 GitHub 仓库；
2. Render 自动检测 Node.js；
3. 在环境变量中填入数据库连接字符串；
4. 部署几分钟后，平台会生成一个公开 URL。

数据库连接示例：

```js
const connection = mysql.createConnection({
  host: 'aws.connect.psdb.cloud',
  user: 'xxxxx',
  password: 'xxxxx',
  database: 'mydb',
  ssl: { rejectUnauthorized: true }
});
```

---

## 🔐 五、安全建议

| 建议项          | 说明                   |
| ------------ | -------------------- |
| ✅ 不要开放数据库给全网 | 最好只让 Node 服务器访问      |
| ✅ 使用强密码      | 避免 root 弱密码          |
| ✅ 定期备份       | 使用 `mysqldump` 备份数据库 |
| ✅ 开启防火墙      | 禁止无关端口访问             |

---

## 🧭 六、总结流程图

```
本地完成开发
   ↓
购买云服务器（Ubuntu）
   ↓
安装 Node.js + MySQL
   ↓
创建数据库和用户
   ↓
上传项目、修改配置
   ↓
启动 Node（pm2）
   ↓
开放端口（3000 + 3306）
   ↓
浏览器访问公网 IP
```

---

✅ **结果：**
你现在的项目可以通过公网访问：

```
http://你的公网IP:3000
```

并且 Node 已经连上 MySQL，完整上线。

---

如果你告诉我：

* 云服务器类型（阿里云 / 腾讯云 / 华为云 / 其他）
* 系统（Ubuntu / CentOS）

我可以帮你生成一份：

> 🧩 一键部署脚本（自动安装 Node + MySQL + PM2 + 配置 + 启动）

你只需要复制粘贴执行即可完成所有步骤。
要我帮你生成这份脚本吗？
