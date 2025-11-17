好的，下面是一个 Express 项目的中间件使用大全，所有的中间件功能都集中在一个 `.js` 文件中，你可以直接运行这个文件来了解如何在 Express 应用中使用不同类型的中间件。

### `middleware-example.js`

```javascript
const express = require('express');
const app = express();
const path = require('path');

// 1. 内置中间件：解析 JSON 和 URL 编码格式的请求体
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码格式的请求体

// 2. 静态文件服务中间件：提供静态文件（如 HTML、CSS、JS）
app.use(express.static(path.join(__dirname, 'public')));  // 'public' 文件夹中的文件会被暴露为静态文件

// 3. 应用级日志中间件：记录每个请求的日志
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();  // 必须调用 next()，否则请求会被挂起
});

// 4. 身份验证中间件：检查请求头中的 token 是否有效
app.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('No token provided');
  }
  if (token !== 'valid-token') {
    return res.status(403).send('Invalid token');
  }
  next();  // 令牌验证成功，继续处理请求
});

// 5. 路由级中间件：记录特定路由的访问日志
app.get('/user/:id', (req, res, next) => {
  console.log(`User ID requested: ${req.params.id}`);
  next();  // 传递给下一个中间件或路由
}, (req, res) => {
  res.send(`User profile for ID: ${req.params.id}`);
});

// 6. 处理请求参数的中间件：验证路径参数
app.get('/product/:id', (req, res, next) => {
  const productId = req.params.id;
  if (isNaN(productId)) {
    return res.status(400).send('Invalid product ID');
  }
  next();  // 参数验证成功，继续处理请求
}, (req, res) => {
  res.send(`Product details for ID: ${req.params.id}`);
});

// 7. 错误处理中间件：捕捉错误并返回适当的响应
app.use((err, req, res, next) => {
  console.error('Something went wrong:', err.stack);
  res.status(500).send('Internal Server Error');
});

// 8. 404 错误处理中间件：当没有匹配的路由时，返回 404
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// 启动服务器
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### 说明：

这个示例包含了多个常见的中间件用途，展示了如何在 Express 应用中使用不同类型的中间件。

1. **内置中间件**：

   * `express.json()` 用于解析 `JSON` 格式的请求体。
   * `express.urlencoded()` 用于解析 `URL-encoded` 格式的请求体。
   * `express.static()` 用于提供静态文件服务，将 `public` 目录下的所有文件暴露为静态资源。

2. **自定义中间件**：

   * **日志中间件**：记录每个请求的 HTTP 方法、URL 和请求时间。
   * **身份验证中间件**：检查请求头中的 `authorization` token 是否有效，模拟用户身份验证。
   * **路由级中间件**：针对特定路由 `/user/:id` 和 `/product/:id`，对路径参数进行验证和日志记录。
   * **请求参数验证中间件**：验证路径中的 `product ID` 是否为有效数字。

3. **错误处理中间件**：

   * **全局错误处理**：捕获并处理全局的应用错误，输出错误堆栈并返回 500 状态码。
   * **404 错误处理**：如果没有匹配到的路由，则返回 404 错误。

### 运行方法：

1. 将这个代码保存为 `middleware-example.js` 文件。
2. 在项目目录下运行以下命令来安装 Express：

   ```bash
   npm install express
   ```
3. 运行这个文件：

   ```bash
   node middleware-example.js
   ```
4. 打开浏览器或 Postman，访问 `http://localhost:3000` 进行测试，看看不同的中间件如何工作。

### 测试不同的中间件：

* **日志中间件**：访问任意路由都会在终端打印日志。
* **静态文件服务**：将静态文件（如 HTML、CSS、JS 文件）放在 `public` 文件夹中，然后访问这些文件。例如，访问 `http://localhost:3000/index.html`。
* **身份验证**：访问任何路由时，都需要在请求头中带上有效的 `Authorization` token（例如 `valid-token`）。如果没有或令牌无效，将返回 403 错误。
* **路径参数验证**：访问 `/product/abc` 会返回 400 错误，因为 `abc` 不是有效的数字。
* **错误处理中间件**：模拟错误，比如在某些路由中手动抛出错误，看看如何捕获并返回 500 错误。

这个项目展示了如何将各种常见的中间件功能集成到一个 Express 项目中，为你提供了一个实践的基础模板。
