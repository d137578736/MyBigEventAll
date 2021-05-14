// 文章的路由模块
const express = require("express");
const router = express.Router();

// 导入需要的处理函数模块
const article_handler = require("../router_handler/article");

// 导入multer和path
// multer第三方库用于接收前端提交的formdata数据
// multer同时可以接收保存文件的存放路径
const multer = require("multer");
const path = require("path");

// 创建multer的实例
// dest是文件存放路径
const uploads = multer({ dest: path.join(__dirname, "../uploads") });

// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
const { add_article_schema } = require("../schema/article");

// 发布文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post(
  "/add",
  uploads.single("cover_img"),
  expressJoi(add_article_schema),
  article_handler.addArticle
);

module.exports = router;
