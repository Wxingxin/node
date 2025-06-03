const express = require("express");
const userCtrl = require('../controller/user');

const router = express.Router();

//用户登录
router.post("/users/login", userCtrl.login);

//用户注册
router.post("/users", userCtrl.register);

//获取当前登录用户
router.get("/user", userCtrl.getCurrentUser);

//跟新当前登录用户
router.put('/user', userCtrl.updateUser)

module.exports = router;
