明白了，你想在 **MongoDB** 中除了 `find()` 之外，还有哪些方法可以操作数据。下面我给你系统整理一下 **CRUD** 的常用方法和用法示例（结合你提供的集合 `user`）：

---

## **1️⃣ 查询数据（Read）**

### 基础查询

```js
db.user.find({ "name": "wei jia xing" })
```

* 返回所有匹配的文档。

### 查询单条文档

```js
db.user.findOne({ "age": 22 })
```

* 返回匹配的第一条文档。

### 条件查询

```js
db.user.find({ "age": { "$gt": 18 } })  // 年龄大于18
db.user.find({ "age": { "$lte": 22 } }) // 年龄小于等于22
```

### 只显示指定字段

```js
db.user.find({ "name": "wei jia xing" }, { "name": 1, "email": 1, "_id": 0 })
```

* `_id: 0` 表示不显示 `_id` 字段。

---

## **2️⃣ 新增数据（Create）**

### 插入单条文档

```js
db.user.insertOne({
    "name": "wei jia xing",
    "age": 22,
    "email": "weijiaxing"
})
```

### 插入多条文档

```js
db.user.insertMany([
    { "name": "Alice", "age": 25, "email": "alice@example.com" },
    { "name": "Bob", "age": 30, "email": "bob@example.com" }
])
```

---

## **3️⃣ 修改数据（Update）**

### 更新单条文档

```js
db.user.updateOne(
    { "name": "wei jia xing" }, 
    { "$set": { "email": "weijiaxing123" } }
)
```

### 更新多条文档

```js
db.user.updateMany(
    { "age": { "$lt": 25 } },
    { "$set": { "status": "young" } }
)
```

### 替换整条文档

```js
db.user.replaceOne(
    { "name": "wei jia xing" },
    { "name": "wei jia xing", "age": 23, "email": "newemail@example.com" }
)
```

---

## **4️⃣ 删除数据（Delete）**

### 删除单条文档

```js
db.user.deleteOne({ "name": "wei jia xing" })
```

### 删除多条文档

```js
db.user.deleteMany({ "age": { "$lt": 20 } })
```

---

💡 **提示**：

* 在 MongoDB Shell、Studio 3T 的 **Shell** 或 **Playground** 都可以执行这些命令。
* 对于批量操作，建议先用 `find()` 检查匹配的文档，避免误删。

---

如果你愿意，我可以帮你写一份 **CRUD 的快速命令表**，以后在 Studio 3T 或 Node.js 都可以直接用。

你想要我帮你整理吗？
