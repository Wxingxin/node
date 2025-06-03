// db.js
const fs = require("fs");
const { promisify } = require("util"); // Node.js 工具，用于将基于回调的函数转换为 Promise
const path = require("path");

// 将 fs.readFile 和 fs.writeFile 都转换为 Promise 版本
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile); // <--- 新增：同样将 fs.writeFile promisify！

const dbPath = path.join(__dirname, "./data.json"); // data.json 文件的路径

/**
 * 从 data.json 加载数据库。
 * 如果 data.json 不存在，则创建一个新的空数据库结构。
 * @returns {Promise<Object>} 数据库对象。
 */
exports.getDb = async () => {
  try {
    const data = await readFile(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // ENOENT 表示“文件或目录不存在”
      console.warn("data.json 未找到。正在创建一个新的空数据库。");
      const initialDb = { todos: [], users: [] }; // 定义你的初始数据库结构
      await exports.saveDb(initialDb); // 将初始的空数据库保存到文件
      return initialDb;
    }
    console.error("读取 data.json 时出错:", error);
    throw new Error("加载数据库失败。");
  }
};

/**
 * 将给定的数据库对象保存回 data.json。
 * @param {Object} db 要保存的数据库对象。
 * @returns {Promise<void>}
 */
exports.saveDb = async (db) => {
  // <--- 新增：导出一个 saveDb 函数
  try {
    // 将 JavaScript 对象转换为 JSON 字符串。
    // `null, 2` 使 JSON 输出更易读（缩进 2 个空格）。
    const data = JSON.stringify(db, null, 2);
    await writeFile(dbPath, data, "utf8"); // 将字符串数据写入文件
    console.log("数据库已保存到 data.json");
  } catch (error) {
    console.error("写入 data.json 时出错:", error);
    throw new Error("保存数据库失败。");
  }
};
