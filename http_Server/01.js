// 1. 引入 Node.js 内置的 http 模块
const http = require('http');

// 2. 定义服务器监听的主机名和端口号
const hostname = '127.0.0.1'; // 或者 'localhost'，表示只接受来自本机的连接
const port = 8000;

// 3. 创建 HTTP 服务器
//    createServer 方法接受一个回调函数作为参数
//    这个回调函数会在每次有 HTTP 请求进来时被调用
//    回调函数接收两个参数：
//      req (request): 代表客户端的请求信息对象
//      res (response): 代表服务器端的响应信息对象
const server = http.createServer((req, res) => {
  // 4. 设置响应状态码为 200 (OK)
  res.statusCode = 200;

  // 5. 设置响应头
  //    Content-Type 告诉浏览器我们发送的是纯文本，编码为 UTF-8
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  // 6. 设置响应体内容，并结束响应
  //    res.end() 会发送响应内容，并告诉服务器响应已完成
  res.end('你好，世界！ Hello, World!\n');
});

// 7. 启动服务器，让它开始监听指定的主机名和端口上的连接
//    listen 方法接受端口号、主机名和一个可选的回调函数
//    这个回调函数在服务器成功启动并开始监听时被调用
server.listen(port, hostname, () => {
  console.log(`服务器运行于 http://${hostname}:${port}/`);
  console.log(`Server running at http://${hostname}:${port}/`);
});