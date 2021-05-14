// 导入数据库操纵模块
const { NotBeforeError } = require("jsonwebtoken");
const db = require("../db/index");
const bcrypt = require("bcryptjs");

// 获取用户基本信息的函数
exports.getUserInfo = (req, res) => {
  // 根据用户的 id，查询用户的基本信息
  // 注意：为了防止用户的密码泄露，需要排除 password 字段
  const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`;
  // 调用sql查询函数
  db.query(sql, req.user.id, (err, results) => {
    // 执行SQL语句失败
    if (err) return res.cc(err);
    // 执行SQL语句成功，但是查询的结果可能为空
    if (results.length !== 1) return res.cc("获取用户信息失败！");

    // 用户信息获取成功
    res.send({
      status: 0,
      message: "获取用户信息成功！",
      data: results[0],
    });
  });
};

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  // 定义待执行的SQL语句  ? 表示占位符，直接将对象中的属性值修改为对应的值
  const sql = `update ev_users set ? where id=?`;
  // 调用db.query() 执行SQL语句并传递参数
  console.log(req.body);
  db.query(sql, [req.body, req.body.id], (err, results) => {
    // 执行SQL语句失败
    if (err) return res.cc(err);
    // 执行SQL语句成功，但是影响行数不等于1
    if (results.affectedRows !== 1) return res.cc("更新用户的基本信息失败");
    // 成功
    res.cc("更新用户信息成功！", 0);
  });
};

// 更新用户密码的函数
exports.updatePassword = (req, res) => {
  // 定义根据 id 查询用户数据的 SQL 语句
  const sql = `select * from ev_users where id=?`;
  db.query(sql, req.user.id, (err, results) => {
    // 执行SQL语句失败
    if (err) return res.cc(err);
    // 判断提交的旧密码是否正确
    if (results.length !== 1) return res.cc("用户不存在！");

    // 判断提交的旧密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    );
    if (!compareResult) return res.cc("原密码错误！");
    // 密码验证没有问题后就将新密码插入到数据库中
    const sqlStr = `update ev_users set password=? where id=?`;
    // 对新密码进行bcrypt加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    // 执行SQL语句，根据id更新用户的密码
    db.query(sqlStr, [newPwd, req.user.id], (err, results) => {
      // SQL语句执行失败
      if (err) return res.cc(err);
      // SQL语句执行成功，但是影响的行数不等于1
      if (results.affectedRows !== 1) return res.cc("更新密码失败!");
      // 更新密码成功
      res.cc("更新密码成功", 0);
    });
  });
};

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  // 1. 定义更新头像的SQL语句
  const sql = `update ev_users set user_pic=? where id=?`;
  // 2. 调用db.query()执行SQL语句
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    // SQL语句执行失败
    if (err) return res.cc(err);
    // 影响的行数是否等于1
    if (results.affectedRows !== 1) return res.cc("更换头像失败！");
    // 成功
    res.cc("更换头像成功！", 0);
  });
};
