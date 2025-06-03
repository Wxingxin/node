const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 8080;

//配置解析表单请求体： application/json
app.use(express.json());
//配置解析表单请求体： application/x-www-form-urlencoded
app.use(express.urlencoded());

//引入封装好的db js文件
const { getDb, saveDb } = require("./db.js");
const { urlToHttpOptions } = require("url");
const { error } = require("console");

//使用原始
app.get("/todos", (req, res) => {
  fs.readFile("./data.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({
        err: err.message,
      });
    }

    const db = JSON.parse(data);
    //db 是一个js对象，就是把 "todos" => todos
    console.log(db);
    res.status(200).json(db.todos);
  });
  //一个请求只有一个响应，所以下面要注释
  // res.send({ message: "data", status: "success" });
});

//使用原始
app.get("/todos/:id", (req, res) => {
  fs.readFile("./data.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    const db = JSON.parse(data);
    //req.params.id 是字符串   todo.id 是数字
    const tureTodo = db.todos.find((todos) => todos.id === 1 * req.params.id);
    if (!tureTodo) {
      return res.status(404).end();
    }
    return res.status(200).json(tureTodo);
  });
});

//使用封装的db.js
app.get("/address", async (req, res) => {
  try {
    const db = await getDb();
    res.status(200).json(db.address);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

//使用封装的db.js
app.get("/address/:id", async (req, res) => {
  try {
    const db = await getDb();
    const trueAddress = db.address.find(
      (address) => address.id === 1 * req.params.id
    );
    if (!trueAddress) {
      throw new error();
    }
    res.status(200).json(trueAddress);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// POST /todos 路由，用于添加新的待办事项 使用封装
app.post("/todos", async (req, res) => {
  const todo = req.body;

  // 基本数据验证
  if (!todo.title) {
    return res.status(422).json({
      error: "标题是必需的",
    });
  }

  try {
    // 1. 从文件中获取当前数据库状态
    const db = await getDb();

    // 2. 生成新的 ID 并将新的 todo 添加到内存中的数组
    const lastTodo = db.todos[db.todos.length - 1];
    todo.id = lastTodo ? lastTodo.id + 1 : 1; // 简单的 ID 生成策略
    db.todos.push(todo);

    // 3. ✨ 关键步骤：将修改后的数据库保存回文件 ✨
    await saveDb(db);

    // 4. 发送成功响应
    // 资源创建的最佳实践是返回 201 Created 状态码
    res.status(201).json(todo);
  } catch (error) {
    // 处理数据库操作期间可能出现的任何错误
    console.error("处理 POST /todos 时出错:", error);
    res.status(500).json({
      error: "由于服务器错误，无法处理你的请求。",
    });
  }
});


/**
 * patch 修改对应的todo  不 使用封装
*/
app.patch("/todos/:id", async (req, res) => {
  try {
    // 1. 从 URL 参数中获取 todo ID，并确保它是数字类型
    const todoId = parseInt(req.params.id);

    // 2. 从请求体中获取要更新的数据（这里是 title）
    const { title, completed } = req.body;

    // 3. 数据验证
    if (isNaN(todoId)) {
      return res.status(400).json({
        // Bad Request
        error: "无效的待办事项 ID。",
      });
    }
    if (!title && completed === undefined) {
      return res.status(422).json({
        // Unprocessable Entity
        error: "请求体中缺少要更新的待办事项数据（如 title 或 completed）。",
      });
    }

    // 4. 直接从文件读取数据 (替代 getDb())
    let db;
    try {
      const data = await fs.readFile(dbPath, "utf8");
      db = JSON.parse(data);
    } catch (readError) {
      if (readError.code === "ENOENT") {
        // 如果文件不存在，可以考虑抛出错误或根据情况初始化
        console.warn(
          "data.json not found during PATCH. This might indicate a problem or empty database."
        );
        return res.status(404).json({ error: "数据文件不存在。" });
      }
      throw readError; // 其他读取错误
    }

    const todos = db.todos;

    // 5. 查找要修改的 todo 事项的索引
    const todoIndex = todos.findIndex((t) => t.id === todoId);

    // 6. 如果找不到对应的 todo，则返回 404
    if (todoIndex === -1) {
      return res.status(404).json({
        error: "找不到对应的待办事项。",
      });
    }

    // 7. 更新 todo 事项
    const todoToUpdate = todos[todoIndex];
    if (title !== undefined) {
      todoToUpdate.title = title;
    }
    if (completed !== undefined) {
      todoToUpdate.completed = completed;
    }

    // 8. 直接将修改后的数据库保存回文件 (替代 saveDb())
    try {
      const updatedData = JSON.stringify(db, null, 2);
      await fs.writeFile(dbPath, updatedData, "utf8");
      console.log("Database saved directly in PATCH route.");
    } catch (writeError) {
      throw writeError; // 写入错误
    }

    // 9. 发送成功响应
    res.status(200).json(todoToUpdate); // 返回更新后的 todo 对象
  } catch (error) {
    // 统一处理所有错误（文件读写、JSON 解析、逻辑错误等）
    console.error("处理 PATCH /todos/:id 时出错:", error);
    res.status(500).json({
      error: "服务器内部错误。",
    });
  }
});

/**
 * patch 修改对应的todo  使用封装
 * 要使用async 
*/
app.patch("/todos/:id", async (req, res) => {
  try {
    // 1. 从 URL 参数中获取 todo ID，并确保它是数字类型
    const todoId = parseInt(req.params.id);

    // 2. 从请求体中获取要更新的数据（这里是 title）
    // PATCH 请求通常只发送需要更新的字段
    const { title, completed } = req.body; // 也可以考虑修改 completed 状态

    // 3. 数据验证
    // 确保 ID 有效且请求体中至少有要更新的字段
    if (isNaN(todoId)) {
      return res.status(400).json({
        // Bad Request
        error: "无效的待办事项 ID。",
      });
    }

    if (!title && completed === undefined) {
      // 如果 title 为空且 completed 未定义
      return res.status(422).json({
        // Unprocessable Entity
        error: "请求体中缺少要更新的待办事项数据（如 title 或 completed）。",
      });
    }

    // 4. 获取当前数据库状态
    const db = await getDb();
    const todos = db.todos;

    // 5. 查找要修改的 todo 事项的索引
    const todoIndex = todos.findIndex((t) => t.id === todoId);

    // 6. 如果找不到对应的 todo，则返回 404
    if (todoIndex === -1) {
      return res.status(404).json({
        error: "找不到对应的待办事项。",
      });
    }

    // 7. 更新 todo 事项
    const todoToUpdate = todos[todoIndex];
    if (title !== undefined) {
      // 只有当请求体提供了 title 时才更新
      todoToUpdate.title = title;
    }
    if (completed !== undefined) {
      // 只有当请求体提供了 completed 时才更新
      todoToUpdate.completed = completed;
    }

    // 8. 将修改后的数据库保存回文件
    await saveDb(db);

    // 9. 发送成功响应
    res.status(200).json(todoToUpdate); // 返回更新后的 todo 对象
  } catch (error) {
    console.error("处理 PATCH /todos/:id 时出错:", error);
    res.status(500).json({
      error: "服务器内部错误。",
    });
  }
});


/**
  * DELETE /todos/:id - 删除指定 ID 的待办事项
 * */ 
app.delete("/todos/:id", async (req, res) => {
  try {
    // 1. 获取要删除的 todo 的 ID，并转换为数字
    const todoId = parseInt(req.params.id);

    // 2. 验证 ID 是否有效
    if (isNaN(todoId)) {
      return res.status(400).json({ // Bad Request
        error: "无效的待办事项 ID。"
      });
    }

    // 3. 获取当前数据库状态
    const db = await getDb();
    let todos = db.todos; // 使用 let，因为我们要修改它

    // 4. 查找要删除的 todo 的索引
    const initialLength = todos.length; // 记录删除前的长度
    db.todos = todos.filter(t => t.id !== todoId); // 过滤掉要删除的 todo

    // 5. 判断是否真的有 todo 被删除
    if (db.todos.length === initialLength) {
      // 如果长度没变，说明没有找到对应的 todo
      return res.status(404).json({
        error: "找不到要删除的待办事项。"
      });
    }

    // 6. 将修改后的数据库保存回文件
    await saveDb(db);

    // 7. 发送成功响应
    // 204 No Content 是 DELETE 成功且无响应体的标准状态码
    res.status(204).end();

  } catch (error) {
    console.error('处理 DELETE /todos/:id 时出错:', error);
    res.status(500).json({
      error: '服务器内部错误。'
    });
  }
});

app.listen(PORT, () => {
  console.log(`运行在 http://localhost:${PORT}`);
});
