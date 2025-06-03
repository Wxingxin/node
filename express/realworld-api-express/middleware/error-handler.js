//util.format() 是 Node.js util 模块中的一个实用函数， 用于格式化字符串
const util = require('util')

module.exports = () => {
  return (err, req, res, next) => {
    res.status(500).json({
      error: util.format(err)
    });
  };
};
