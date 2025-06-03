const express = require("express");
const router = express.Router();

// Get Tags
router.get("/tags", async (req, res, next) => {
  try {
    // 处理请求
    res.send("get /tags");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
