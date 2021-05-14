// 这是路由处理函数模块

// 导入数据库操纵模块
const db = require("../db/index");

// 获取文章分类列表的处理函数
exports.getArtCates = (req, res) => {
  // 定义查询分类列表数据的SQL语句
  const sql = `select * from ev_article_cate where is_delete=0 order by id asc`;

  // 调用db.query()执行SQL语句
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: "获取文章分类成功!",
      data: results,
    });
  });
};

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
  // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
  const sql = `select * from ev_article_cate where name=? or alias=?`;
  // 执行查重操作
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);

    // 判断 分类名称 和 分类别名 是否被占用
    if (results.length === 2)
      return res.cc("分类名称与别名被占用，请更换后重试！");
    // 分别判断 分类名称 和 分类别名 是否被占用
    if (results.length === 1 && results[0].name === req.body.name)
      return res.cc("分类名称被占用，请更换后重试！");
    if (results.length === 1 && results[0].alias === req.body.alias)
      return res.cc("分类别名被占用，请更换后重试！");

    // TODO：新增文章分类
    // 定义插入文章分类的sql语句
    const sqlStr = `insert into ev_article_cate set ? `;
    // 执行插入文章分类的sql语句
    db.query(sqlStr, req.body, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("新增文章分类失败！");
      res.send({
        status: 0,
        message: "新增文章分类成功！",
      });
    });
  });
};

// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
  // 定义标记删除的SQL语句
  const sql = `update ev_article_cate set is_delete=1 where id=?`;
  // 调用db.query执行SQL语句
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("删除文章分类失败！");
    res.cc("删除文章分类成功", 0);
  });
};

// 根据Id获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
  const sql = `select * from ev_article_cate where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("获取文章分类数据失败！");
    // 把数据响应给客户端
    res.send({
      status: 0,
      message: "获取文章分类数据成功！",
      data: results[0],
    });
  });
};

// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
  // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
  // <>表示不等于，这样就可以看看其他的里面是否有冲突的名字
  const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`;
  db.query(
    sql,
    [req.body.Id, req.body.name, req.body.alias],
    (err, results) => {
      if (err) return res.cc(err);
      // 判断 分类名称 和 分类别名 是否被占用
      if (results.length === 2)
        return res.cc("分类名称与别名被占用，请更换后重试！");
      if (results.length === 1 && results[0].name === req.body.name)
        return res.cc("分类名称被占用，请更换后重试！");
      if (results.length === 1 && results[0].alias === req.body.alias)
        return res.cc("分类别名被占用，请更换后重试！");
      const sqlStr = `update ev_article_cate set ? where Id=?`;
      db.query(sqlStr, [req.body, req.body.Id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("更新文章分类失败");
        res.cc("更新文章分类成功！");
      });
    }
  );
};
