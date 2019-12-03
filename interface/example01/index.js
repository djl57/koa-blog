const router = require("koa-router")();
const partName = "/example01";
const DB = require("../../db/index");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secretOrPrivateKey = "secret";
/**
 * @func
 * @todo nope
 * @desc RESTful - POST
 * @param {int} userid 用户id
 * @param {string} username 用户名
 * @param {string} password 密码
 * @param {string} useremail 用户邮箱
 * @requestExample http://localhost:3001/example01/register 设置body={"username": "djlun","password": "123456","useremail": "123@163.com"}
 * @returns {func} 返回值为一个函数
 * @returnParam {object} ctx (request和response可省略)
 * @returnParam {object} ctx.request
 * @returnParam {string} ctx.request.method POST （等同于ctx.method）
 * @returnParam {string} ctx.request.url /example01/register
 * @returnParam {object} ctx.request.header 头部信息
 * @returnParam {object} ctx.request.body 所传参数 {"username": "djlun","password": "123456","useremail": "123@163.com"}
 * @returnParam {object} ctx.response
 * @returnParam {object} ctx.response.status 请求返回状态
 * @returnParam {object} ctx.response.message 请求返回信息
 * @returnParam {object} ctx.response.body 请求返回主体
 */
/* 
  300 用户输入内容报错
  500 数据库报错
  200 正常
  600 jsonwebtoken报错
*/
router.post(partName + "/register", async ctx => {
  const body = ctx.request.body;
  const { username, useremail, password } = body;
  try {
    const result = await DB.sqlQuery("SELECT * FROM `user` WHERE `useremail` = ?", [useremail]); /* 查 */
    if (result.length !== 0) {
      ctx.body = { code: 300, msg: "邮箱已存在" };
      return;
    }
    try {
      const hashPassword = await bcrypt.hash(password, saltRounds);
      await DB.sqlQuery("INSERT INTO user SET ?", { username, useremail, password: hashPassword }); /* 增 */
      ctx.body = { code: 200, msg: "用户添加成功" };
    } catch (error) {
      ctx.body = { code: 500, msg: "用户添加失败" };
    }
  } catch (error) {
    ctx.body = { code: 500, msg: "邮箱验证失败" };
  }
});

router.post(partName + "/login", async ctx => {
  const body = ctx.request.body;
  const { useremail, password } = body;
  const result = await DB.sqlQuery("SELECT * FROM `user` WHERE `useremail` = ?", [useremail]);
  if (result.length === 0) {
    ctx.body = { code: 300, msg: "用户不存在" };
    return;
  }
  const match = await bcrypt.compare(password, result[0].password);
  if (match) {
    try {
      /* jwt.sign("规则", "加密名字", "过期时间", "箭头函数") */
      const rule = { userid: result[0].userid, username: result[0].username };
      const token = await jwt.sign(rule, secretOrPrivateKey, { expiresIn: "1h" });
      ctx.body = { code: 200, msg: "登录成功！", token: "example01-" + token };
    } catch (error) {
      ctx.body = { code: 600, msg: "token 生成失败" };
    }
  } else {
    ctx.body = { code: 300, msg: "密码错误" };
  }
});

module.exports = router;
