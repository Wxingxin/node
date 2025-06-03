const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
//错误处理
const errorHandle = require('./middleware/error-handler')

//引入路由
const router = require('./router/index')

const cors = require("cors");
const morgan = require("morgan");

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("dev"));
app.use(cors());


//挂载路由
app.use('/api', router)

//挂载统一处理服务器端错误中间件
app.use(errorHandle())


app.listen(PORT, () => {
  console.log(`port si: http://loaclhost:${PORT}`);
});
