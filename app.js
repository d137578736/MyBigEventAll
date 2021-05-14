// 导入express
const express = require("express");
// 创建服务器的实例对象
const app = express();

// 导入并配置cors中间件 解决跨域问题
const cors = require("cors");
app.use(cors());

// 配置解析表单数据的中间件 注意：这个中间件，只能解析application/x-www-form-urlencoded格式的表单信息
app.use(express.urlencoded({ extended: false }));

// 托管图片静态资源
app.use("/uploads", express.static("./uploads"));

// 托管网页静态资源
app.use(express.static("./pages"));

// 响应数据的中间件，挂着一个错误处理函数
app.use(function (req, res, next) {
  // status 0 成功 status=1 失败，默认将status值设置为1 方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      status,
      // 判断err是错误对象还是字符串
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 一定要在路由之前配置解析Token的中间件
const expressJWT = require("express-jwt");
const config = require("./config");

app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] })
);

// 导入并使用用户路由模块
const userRouter = require("./router/user");
app.use("/api", userRouter);
// 导入并使用用户路由模块
const userinfoRouter = require("./router/userinfo");
app.use("/my", userinfoRouter);
// 导入并使用文章分类的路由模块
const artCateRouter = require("./router/artcate");
app.use("/my/article", artCateRouter);
// 导入并使用文章的路由
const artcleRouter = require("./router/article");
app.use("/my/article", artcleRouter);

const joi = require("@hapi/joi");
// 定义错误级别的中间件
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) return res.cc(err);
  if (err.name === "UnauthorizedError") return res.cc("身份认证失败！");
  // 未知的错误
  res.cc(err);
});

// 启动服务器
app.listen(3007, () => {
  console.log("api server running at http://127.0.0.1:3007");
});
