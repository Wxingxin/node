下面给你讲解 **Node.js 中 Cloudinary 的使用**，从最基础到进阶 + 经典项目案例（Express + Cloudinary 实现用户头像上传）。

我会从 **0 基础 → 实战 → 进阶优化** 带你完整走一遍。

---

# 🌥️ 1. Cloudinary 是什么？

一个在线 **图片/视频上传 + 存储 + 转码 + CDN** 的服务。

优点：

✔ 图片存云端，不占服务器硬盘
✔ 自动生成 URL（CDN 加速）
✔ 支持图片压缩、裁剪、格式化
✔ 权限管理好，不怕泄露系统文件
✔ 和前端/小程序/Flutter/Node 都兼容

这是 **比本地上传更专业、更安全** 的做法。

---

# 📦 2. 安装 Cloudinary SDK

```bash
npm install cloudinary multer multer-storage-cloudinary
```

如果不想使用 multer，也可以直接上传 buffer（后面讲）。

---

# 🔑 3. 创建 Cloudinary 账号（必做）

进入 cloudinary.com → 登录 → Dashboard
找到你的凭证：

✔ Cloud Name
✔ API Key
✔ API Secret

然后在 Node 项目中创建 `.env`：

```
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxxx
CLOUDINARY_API_SECRET=xxxxxx
```

---

# ⚙️ 4. Cloudinary 配置（基础）

创建一个配置文件 `/config/cloudinary.js`：

```js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```

---

# 📤 5. **基础上传示例**（最简单）

```js
const cloudinary = require("./config/cloudinary");

cloudinary.uploader.upload("./avatar.jpg")
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

返回结果包含：

```
{
  url: 'https://res.cloudinary.com/.../image/upload/v123/avatar.jpg',
  public_id: 'xxxxx',
  secure_url: 'https://xxxx',
  ...
}
```

✔ 不需要自己拼 URL
✔ 永久保存
✔ CDN 自动加速

---

# 🖼️ 6. Express + Multer + Cloudinary 上传头像（经典后端）

### 创建 storage（自动上传到 Cloudinary）

```js
const cloudinary = require("./config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",     // 保存到 Cloudinary 的文件夹
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

module.exports = upload;
```

---

# 📸 7. Express 路由（上传接口）

```js
const express = require("express");
const router = express.Router();
const upload = require("../config/multer-cloud");

router.post("/avatar", upload.single("avatar"), (req, res) => {
  // 上传成功后 Multer 会在 req.file 中放入 Cloudinary 信息
  res.json({
    message: "上传成功",
    url: req.file.path,        // Cloudinary 图片 URL
    public_id: req.file.filename,
  });
});

module.exports = router;
```

---

# 🧪 8. 前端（React）上传示例

```js
const handleUpload = async () => {
  const formData = new FormData();
  formData.append("avatar", fileInput.files[0]);

  const res = await fetch("http://localhost:3000/avatar", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  console.log(data.url);  // 云端的图片地址
};
```

之后头像 URL 存数据库即可，不要存图片本体。

---

# 🧹 9. 删除 Cloudinary 文件（进阶）

```js
const cloudinary = require("./config/cloudinary");

cloudinary.uploader.destroy("avatars/xxxxxx")
  .then(result => console.log("删除成功", result))
  .catch(err => console.error(err));
```

可以用于：

✔ 用户修改头像时删除旧头像
✔ 删除无用图片
✔ 清理资源

---

# ✨ 10. 进阶：上传 Buffer（不需要 multer，也不需要文件）

适合：

✔ Base64
✔ Flutter / React Native 上传
✔ 前端压缩完后直接发 Buffer

```js
const cloudinary = require("./config/cloudinary");

const uploadBuffer = async (buffer) => {
  return await cloudinary.uploader.upload_stream(
    { folder: "avatars" },
    (err, result) => {
      if (result) console.log(result);
      else console.error(err);
    }
  ).end(buffer);
};
```

---

# ⚡ 11. 进阶：图片自动压缩、裁剪、WebP

示例：自动压缩 + 格式转换 + 限制宽度

```js
cloudinary.uploader.upload("avatar.jpg", {
  folder: "avatars",
  width: 300,
  crop: "scale",
  format: "webp",
  quality: "auto"
});
```

---

# 🧠 Cloudinary 最常用的功能总结

| 功能                         | 是否必学        |
| -------------------------- | ----------- |
| 图片上传（基础）                   | ✔ 必学        |
| Multer + CloudinaryStorage | ✔ 必学        |
| 删除资源                       | ✔ 必学（修改头像时） |
| 自动压缩与裁剪                    | ✔ 推荐        |
| 上传 buffer（不用文件）            | 进阶          |
| 视频上传                       | 可选          |

---

# 📌 如果你需要，我可以给你：

### ✔ 一个完整可跑的项目模板：

* Node + Express
* Cloudinary 上传头像
* MongoDB 保存头像 URL
* 用户注册 + 登录（bcrypt + JWT）
* React 前端上传与显示头像

你要我帮你生成一份完整项目吗？
