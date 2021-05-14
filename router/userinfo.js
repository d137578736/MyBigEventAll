const express = require("express");
const router = express.Router();

// 挂载路由

// 导入路由处理函数模块
const userinfo_hander = require("../router_handler/userinfo");

// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入需要验证规则对象 解构赋值
const {
  update_userinfo_schema,
  update_password_schema,
  update_avatar_schema,
} = require("../schema/user");

// 获取用户基本信息的路由
// 首先进入验证数据的中间件  通过验证之后才会进入回调处理函数，否则抛出错误
router.get("/userinfo", userinfo_hander.getUserInfo);

// 更新用户信息的路由
router.post(
  "/userinfo",
  expressJoi(update_userinfo_schema),
  userinfo_hander.updateUserInfo
);

// 更新密码的路由
router.post(
  "/updatepwd",
  expressJoi(update_password_schema),
  userinfo_hander.updatePassword
);

// 更换头像的路由
router.post(
  "/update/avatar",
  expressJoi(update_avatar_schema),
  userinfo_hander.updateAvatar
);

module.exports = router;
