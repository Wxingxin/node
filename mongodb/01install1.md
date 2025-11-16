# 
✔ 方法 1：手动指定 dbPath，重新启动 mongod

你现在是 直接 运行 mongod，但 Windows 上必须要有 数据目录 才能正常运行 MongoDB。

默认位置一般没有自动创建，会报隐藏错误。

# 
✔ 方法 2：使用“服务模式”启动（推荐，后台自动运行）

如果你是用 MSI 安装 MongoDB，它会自动安装为 Windows 服务：

你可以试试运行：

net start MongoDB


如果出现：

The MongoDB service is starting.
The MongoDB service was started successfully.


说明后台服务启动成功，这样你不需要手动开 mongod，Studio 3T 也能自动连接。