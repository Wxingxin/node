const { User } = require("../model");

// Registration 用户注册 链接数据库
exports.register = async (req, res, next) => {
  try {
    let user = new User(req.body.user);
    // 保存到数据库
    await user.save();
    // 转成json
    user = user.toJSON();
    // 删除密码属性
    delete user.password;
    // 4. 发送成功响应，返回用户数据
    res.status(201).json({
      user,
    });
  } catch (err) {
    next(err);
  }
};

// Authentication 用户登录
exports.login = async (req, res, next) => {
  try {
    // 处理请求
    res.send("post /users/login");
  } catch (err) {
    next(err);
  }
  
};

// Registration 用户注册  没有链接数据库
// exports.register = async (req, res, next) => {
//   try {
//     // 处理请求
//     res.send("post /users");
//   } catch (err) {
//     next(err);
//   }
// };

// Get Current User 获取当前登录用户
exports.getCurrentUser = async (req, res, next) => {
  try {
    // 处理请求
    res.send("get /user");
  } catch (err) {
    next(err);
  }
};

// Update User 更新用户
exports.updateUser = async (req, res, next) => {
  try {
    // 处理请求
    res.send("put /user");
  } catch (err) {
    next(err);
  }
};
