在一个 **Express** 项目中实现 **WebSocket** 和 **Socket.IO** 的简单案例，可以让我们了解如何在实时应用中使用这两种技术。我们将分别展示如何使用 **原生 WebSocket** 和 **Socket.IO** 在 Express 项目中创建一个简单的实时聊天应用。

### 1. 使用 WebSocket 实现简单聊天功能

首先，我们通过 Express 和 WebSocket 创建一个最简单的案例。

#### 步骤 1：初始化项目

首先，创建一个新的项目并安装所需的依赖：

```bash
mkdir websocket-example
cd websocket-example
npm init -y
npm install express ws
```

#### 步骤 2：创建服务器

在项目根目录下创建 `server.js` 文件，并添加以下内容：

```javascript
const express = require('express');
const WebSocket = require('ws');  // 引入 WebSocket 库
const http = require('http');

// 创建 Express 应用
const app = express();
const server = http.createServer(app);  // 使用 http server 启动 Express 应用

// 创建 WebSocket 服务器并绑定到 HTTP 服务器
const wss = new WebSocket.Server({ server });

// 处理 WebSocket 连接
wss.on('connection', (ws) => {
    console.log('A client connected');
    
    // 监听客户端消息
    ws.on('message', (message) => {
        console.log('Received:', message);
        
        // 广播消息到所有客户端
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // 向客户端发送一条欢迎消息
    ws.send('Welcome to the WebSocket server!');
});

// 提供静态文件（例如前端页面）
app.use(express.static('public'));

// 启动服务器
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

#### 步骤 3：创建前端页面

在项目根目录下创建 `public` 文件夹，并在其中创建一个 `index.html` 文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket Chat</title>
</head>
<body>
    <h1>WebSocket Chat</h1>
    <input type="text" id="messageInput" placeholder="Type a message">
    <button onclick="sendMessage()">Send</button>

    <ul id="messages"></ul>

    <script>
        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        ws.onmessage = (event) => {
            const li = document.createElement('li');
            li.textContent = event.data;
            document.getElementById('messages').appendChild(li);
        };

        function sendMessage() {
            const message = document.getElementById('messageInput').value;
            if (message) {
                ws.send(message);
                document.getElementById('messageInput').value = '';
            }
        }
    </script>
</body>
</html>
```

#### 步骤 4：运行应用

确保服务器运行在本地 `3000` 端口上。启动应用：

```bash
node server.js
```

现在，打开浏览器并访问 `http://localhost:3000`，你会看到一个简单的聊天界面。不同的浏览器标签页或者客户端都可以通过 WebSocket 进行实时消息的交换。

### 2. 使用 Socket.IO 实现简单聊天功能

接下来，我们使用 **Socket.IO** 来实现一个类似的简单聊天功能。

#### 步骤 1：初始化项目

首先，安装依赖（已经有 Express）：

```bash
npm install socket.io
```

#### 步骤 2：创建服务器

更新 `server.js` 文件，使用 Socket.IO 来代替 WebSocket：

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// 创建 Express 应用
const app = express();
const server = http.createServer(app);

// 创建 Socket.IO 实例并绑定到 HTTP 服务器
const io = socketIo(server);

// 监听客户端连接
io.on('connection', (socket) => {
    console.log('A client connected');
    
    // 监听客户端消息
    socket.on('message', (message) => {
        console.log('Received:', message);
        
        // 广播消息给所有客户端
        io.emit('message', message);
    });

    // 向客户端发送一条欢迎消息
    socket.emit('message', 'Welcome to the Socket.IO server!');
});

// 提供静态文件（例如前端页面）
app.use(express.static('public'));

// 启动服务器
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

#### 步骤 3：创建前端页面

更新 `public/index.html` 文件，使用 Socket.IO 客户端来连接：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Socket.IO Chat</title>
    <script src="/socket.io/socket.io.js"></script>
</head>
<body>
    <h1>Socket.IO Chat</h1>
    <input type="text" id="messageInput" placeholder="Type a message">
    <button onclick="sendMessage()">Send</button>

    <ul id="messages"></ul>

    <script>
        const socket = io('http://localhost:3000');

        // 监听来自服务器的消息
        socket.on('message', (message) => {
            const li = document.createElement('li');
            li.textContent = message;
            document.getElementById('messages').appendChild(li);
        });

        function sendMessage() {
            const message = document.getElementById('messageInput').value;
            if (message) {
                socket.emit('message', message);
                document.getElementById('messageInput').value = '';
            }
        }
    </script>
</body>
</html>
```

#### 步骤 4：运行应用

重新启动服务器：

```bash
node server.js
```

访问 `http://localhost:3000`，你会看到一个简单的聊天界面，支持客户端之间的实时消息交换。

### 总结

* **WebSocket** 代码更简单，但需要手动处理很多功能（如重连、广播等）。
* **Socket.IO** 提供了更多的功能和易用性，自动处理重连、事件、跨浏览器兼容等，是一个更高层次的封装。

根据你的项目需求，可以选择使用原生的 WebSocket 或者使用功能更丰富的 Socket.IO。如果你的项目需要处理更复杂的实时通信，可以优先考虑 Socket.IO。
