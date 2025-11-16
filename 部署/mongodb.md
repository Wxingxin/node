太好了 👍！
你能主动问“自己在云服务器上安装 MongoDB 要怎么配置”，说明你已经进入 **部署实战阶段** 了，这一步非常关键。

别担心我会一步步教你从 **0 配置到能连接数据库**，
即使你完全是小白也能搞定 💪。

---

## 🧠 一、目标说明

我们要实现的是：

> 在云服务器（例如 阿里云 / 腾讯云 / 华为云）上，自己安装 MongoDB，让本地电脑或 Node 项目能远程访问。

最终你会得到一个连接字符串：

```
mongodb://admin:123456@你的服务器公网IP:27017/mydb
```

---

## ⚙️ 二、环境准备

1. ✅ 一台云服务器（推荐 Ubuntu 22.04）
2. ✅ 能 SSH 登录（如用 `ssh root@你的IP`）
3. ✅ 拥有 root 权限

---

## 🪜 三、安装步骤（超详细）

### 🧩 第 1 步：更新系统

```bash
sudo apt update
sudo apt upgrade -y
```

---

### 🧩 第 2 步：安装 MongoDB（推荐官方源）

> Ubuntu 自带版本老，我们直接使用 MongoDB 官方源安装。

1️⃣ 添加官方源：

```bash
sudo apt-get install gnupg curl -y
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
```

2️⃣ 添加 MongoDB 官方源地址：

```bash
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] \
https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

3️⃣ 安装 MongoDB：

```bash
sudo apt update
sudo apt install -y mongodb-org
```

---

### 🧩 第 3 步：启动 MongoDB 服务

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

检查是否运行成功：

```bash
sudo systemctl status mongod
```

看到 `active (running)` ✅ 就说明成功了！

---

### 🧩 第 4 步：进入 Mongo Shell（命令行客户端）

```bash
mongosh
```

---

### 🧩 第 5 步：创建数据库用户

进入 Mongo shell 后输入以下命令 👇

```js
use admin
db.createUser({
  user: "admin",
  pwd: "123456",
  roles: [{ role: "root", db: "admin" }]
})
```

输出：

```
Successfully added user: { "user" : "admin", "roles" : [ "root" ] }
```

✅ 表示创建成功！

---

### 🧩 第 6 步：修改配置文件以允许远程访问

打开 MongoDB 配置文件：

```bash
sudo nano /etc/mongod.conf
```

找到下面这段：

```yaml
net:
  port: 27017
  bindIp: 127.0.0.1
```

👉 修改为：

```yaml
net:
  port: 27017
  bindIp: 0.0.0.0
```

这样 MongoDB 就允许外部（远程）访问了。

---

### 🧩 第 7 步：开启身份验证（非常重要！）

在同一个文件中找到：

```yaml
#security:
```

修改为：

```yaml
security:
  authorization: enabled
```

保存退出（Ctrl + O → 回车 → Ctrl + X）

---

### 🧩 第 8 步：重启 MongoDB

```bash
sudo systemctl restart mongod
```

---

### 🧩 第 9 步：在云服务器防火墙中开放端口

#### 如果你使用阿里云 / 腾讯云：

* 打开控制台 → “安全组” → 编辑规则
* 添加规则：

  * 协议端口：`27017`
  * 授权对象：`0.0.0.0/0`（任何 IP）
  * （上线后建议改成固定 IP）

#### 如果是 Ubuntu 自带防火墙：

```bash
sudo ufw allow 27017
sudo ufw reload
```

---

### 🧩 第 10 步：测试连接

在你本地电脑（或 Node 项目）中运行：

```js
import mongoose from 'mongoose';

const uri = 'mongodb://admin:123456@你的服务器公网IP:27017/mydb?authSource=admin';

mongoose.connect(uri)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => console.log('❌ Error:', err));
```

如果控制台输出：

```
✅ MongoDB connected!
```

恭喜你 🎉，MongoDB 已经上线成功！

---

## 🔐 四、安全建议（必须看！）

| 项        | 建议                                 |
| -------- | ---------------------------------- |
| ✅ 设置强密码  | 不要用“123456”上线                      |
| ✅ 启用身份验证 | 确保 security.authorization: enabled |
| ✅ 限制 IP  | 安全组只放行服务器的 IP                      |
| ✅ 禁止匿名访问 | 删除没有密码的用户                          |
| ✅ 定期备份数据 | 可用 `mongodump` 备份数据库               |

---

## ✅ 五、总结流程图

```
（1）登录云服务器
     ↓
（2）安装 MongoDB
     ↓
（3）创建用户 admin
     ↓
（4）修改配置文件允许外部访问
     ↓
（5）开启授权
     ↓
（6）防火墙放行 27017 端口
     ↓
（7）使用 mongoose 连接测试
```

---

## 🧩 六、连接字符串模板

| 场景        | 连接字符串                                                   |
| --------- | ------------------------------------------------------- |
| 本地        | `mongodb://127.0.0.1:27017/mydb`                        |
| 云服务器（带验证） | `mongodb://admin:密码@你的公网IP:27017/mydb?authSource=admin` |

---

如果你告诉我：

* 你用的是什么云服务器（比如阿里云 / 腾讯云）
* 系统版本（例如 Ubuntu 22.04 或 CentOS 7）

我可以帮你 **写一份完全适配你服务器的命令脚本**，
直接复制粘贴到终端运行即可一键部署。
要我帮你生成这一份吗？
