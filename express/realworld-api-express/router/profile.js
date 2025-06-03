const express = require("express");
const router = express.Router();

//获取用户资料
router.get("/:username", async (req, res, next) => {
  try {
    res.send("post /porfile/:username");
  } catch (error) {
    next(error);
  }
});

//关注用户
router.post("/:username/follow", async (req, res, next) => {
  try {
    res.send("post /profile/:username/follow");
  } catch (error) {
    next(error);
  }
});

//取消关注用户
router.delete("/:username/follow", async (req, res, next) => {
  try {
    res.send("post /profile/:usename/follow");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
