// 1.导入定义验证规则的模块
const joi = require("@hapi/joi");
// 2.定义name和alias的验证规则
const name = joi.string().required();
// alphanum表示字母和数字
const alias = joi.string().alphanum().required();

// 定义分类Id的校验规则
const id = joi.number().integer().min(1).required();

// 2. 定义验证规则
// 注意：如果客户端提交的某些参数项未在 schema 中定义，
// 此时，这些多余的参数项默认会被忽略掉
// const userSchema = {
//   // 2.1 校验 req.body 中的数据
//   body: {
//     username: Joi.string().alphanum().min(3).max(12).required(),
//     password: Joi.string().pattern(/^[\S]{6,15}$/).required(),
//     repassword: Joi.ref('password'),
//   },
//   // 2.2 校验 req.query 中的数据
//   query: {
//     name: Joi.string().alphanum().min(3).required(),
//     age: Joi.number().integer().min(1).max(100).required(),
//   },
//   // 2.3 校验 req.params 中的数据
//   params: {
//     id: Joi.number().integer().min(0).required(),
//   },
// }

// 3.向外共享验证规则对象
exports.add_cate_schema = {
  body: {
    name,
    alias,
  },
};

// 校验规则对象 删除分类
exports.delete_cate_schema = {
  params: {
    id,
  },
};

// 验证规则对象 根据id获取文章分类
exports.get_cate_schema = {
  params: {
    id,
  },
};

// 校验规则对象 更新分类
exports.update_cate_schema = {
  body: {
    Id: id,
    name,
    alias,
  },
};
