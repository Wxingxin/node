// db.js
const { MongoClient, ObjectId } = require("mongodb");

// MongoDB 配置
const url = "mongodb://127.0.0.1:27017"; // 本地 MongoDB
const dbName = "onedatabase"; // 数据库名称
let db = null; // 用于保存数据库连接对象

// 连接数据库
async function connect() {
  if (db) return db; // 已经连接过就直接返回
  const client = new MongoClient(url, { useUnifiedTopology: true });
  await client.connect();
  console.log("MongoDB connected!");
  db = client.db(dbName);
  return db;
}

// 查询
async function find(collectionName, query = {}) {
  const db = await connect();
  return db.collection(collectionName).find(query).toArray();
}

// 插入
async function insert(collectionName, data) {
  const db = await connect();
  return db.collection(collectionName).insertOne(data);
}

// 更新
async function update(collectionName, id, data) {
  const db = await connect();
  return db
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
}

// 删除
async function remove(collectionName, id) {
  const db = await connect();
  return db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
}

// 导出
module.exports = { connect, find, insert, update, remove };
