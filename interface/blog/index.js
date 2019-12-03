const router = require("koa-router")();
const DB = require("../../db/index");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const status = require("./config");
const Auth = require("./../../utils/auth");
const Utils = require("../../utils/index");

const partName = "/myblog";

router.post(partName + "/register", async ctx => {
  const body = ctx.request.body;
  const { nickname, email, password, confirm } = body;
  if (password !== confirm) {
    ctx.body = { code: status.PARAMS_B, msg: "两次密码输入不一致！" };
    return;
  }
  try {
    const result = await DB.sqlQuery("SELECT * FROM `user` WHERE `email` = ?", [email]); /* 查 */
    if (result.length !== 0) {
      ctx.body = { code: status.PARAMS_B, msg: "此邮箱已注册！" };
      return;
    }
    try {
      const hashPassword = await bcrypt.hash(password, saltRounds);
      await DB.sqlQuery("INSERT INTO user SET ?", { nickname, email, password: hashPassword }); /* 增 */
      ctx.body = { code: status.SUCCESS, msg: "注册成功！" };
    } catch (error) {
      console.log(error);
      ctx.body = { code: status.SQL_ERR, msg: "注册失败！" };
    }
  } catch (error) {
    ctx.body = { code: status.SQL_ERR, msg: "邮箱验证失败！" };
  }
});

router.post(partName + "/login", async ctx => {
  const body = ctx.request.body;
  console.log("-----body----", body);
  const { email, password } = body;
  const result = await DB.sqlQuery("SELECT * FROM `user` WHERE `email` = ?", [email]);
  if (result.length === 0) {
    ctx.body = { code: status.PARAMS_B, msg: "用户不存在！" };
    return;
  }
  const match = await bcrypt.compare(password, result[0].password);
  if (match) {
    try {
      /* jwt.sign("规则", "加密名字", "过期时间", "箭头函数") */
      const rule = { user_id: result[0].user_id, nickname: result[0].nickname, email: result[0].email };
      const token = await jwt.sign(rule, Auth.secretOrPrivateKey, { expiresIn: "1h" });
      ctx.body = { code: status.SUCCESS, msg: "登录成功！", token: "Bearer " + token, data: result[0] };
    } catch (error) {
      ctx.body = { code: status.NO_AUTH_A, msg: "token 生成失败！" };
    }
  } else {
    ctx.body = { code: status.PARAMS_B, msg: "密码错误！" };
  }
});

router.post(partName + "/addTag", async ctx => {
  const body = ctx.request.body;
  const promise = DB.sqlQuery("INSERT INTO tag SET ?", { ...body, createTime: new Date().toLocaleString() });
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    ctx.body = { code: status.SUCCESS, msg: "添加成功" };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "添加失败" };
  }
});

router.get(partName + "/getTags", async ctx => {
  const pageSize = 1;
  const pageNum = 10;
  const promise = DB.sqlQuery("SELECT * FROM `tag` limit ?,?", [(pageSize - 1) * pageNum, pageNum]); /* 分页查 */
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    ctx.body = { code: status.SUCCESS, data: data };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "查询失败" };
  }
});

router.del(partName + "/delTag", async ctx => {
  const promise = DB.sqlQuery("DELETE FROM `tag` WHERE `id` = ?", [ctx.query.id]); /* 删 */
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    ctx.body = { code: status.SUCCESS, msg: "删除成功" };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "删除失败" };
  }
});

router.put(partName + "/putTag", async ctx => {
  const { name, id } = ctx.request.body;
  const promise = DB.sqlQuery("UPDATE `tag` SET `name` = ? WHERE `id` = ?", [name, id]); /* 改 */
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    ctx.body = { code: status.SUCCESS, msg: "更改成功" };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "更改失败" };
  }
});

router.post(partName + "/addCatagory", async ctx => {
  const body = ctx.request.body;
  const promise = DB.sqlQuery("INSERT INTO catagory SET ?", { ...body, createTime: new Date().toLocaleString() });
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    ctx.body = { code: status.SUCCESS, msg: "添加成功" };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "添加失败" };
  }
});

router.get(partName + "/getCatagorys", async ctx => {
  const pageSize = 1;
  const pageNum = 10;
  const promise = DB.sqlQuery("SELECT * FROM `catagory` limit ?,?", [(pageSize - 1) * pageNum, pageNum]); /* 分页查 */
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    ctx.body = { code: status.SUCCESS, data: data };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "查询失败" };
  }
});

router.del(partName + "/delCatagory", async ctx => {
  const promise = DB.sqlQuery("DELETE FROM `catagory` WHERE `id` = ?", [ctx.query.id]); /* 删 */
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    ctx.body = { code: status.SUCCESS, msg: "删除成功" };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "删除失败" };
  }
});

router.put(partName + "/putCatagory", async ctx => {
  const { name, id } = ctx.request.body;
  const promise = DB.sqlQuery("UPDATE `catagory` SET `name` = ? WHERE `id` = ?", [name, id]); /* 改 */
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    ctx.body = { code: status.SUCCESS, msg: "更改成功" };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "更改失败" };
  }
});

router.post(partName + "/addArticle", async ctx => {
  const body = ctx.request.body;
  const promise = DB.sqlQuery("INSERT INTO article SET ?", { ...body, createTime: new Date().toLocaleString() });
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    ctx.body = { code: status.SUCCESS, msg: "发布成功" };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "发布失败，请重试" };
  }
});

router.get(partName + "/getArticles", async ctx => {
  const { pageSize, pageNum, catagory } = ctx.query;
  let _sql;
  if (catagory) {
    _sql = `SELECT * FROM article WHERE catagory = ? limit ${(pageNum - 1) * pageSize},${pageSize}`; /* 分页查 */
  } else {
    _sql = `SELECT * FROM article limit ${(pageNum - 1) * pageSize},${pageSize}`; /* 分页查 */
  }
  const promise = DB.sqlQuery(_sql, [catagory]);
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    const res = [];
    for (let i = 0, len = data.length; i < len; i++) {
      const { catagory, tag } = data[i];
      let catagoryName = [];
      let tagName = [];
      if (!catagory) {
        if (!tag) {
          res.push({ ...data[i], catagoryName: catagoryName, tagName: tagName });
        } else {
          for (let t = 0, len = tag.length; t < len; t++) {
            const sql2 = DB.sqlQuery("SELECT * FROM `tag` WHERE id = ?", [+tag[t]]);
            const [err2, data2] = await Utils.awaitWrap(sql2);
            if (err2) {
              ctx.body = { code: status.SQL_ERR, msg: "生成分类名称失败" };
              return;
            } else {
              tagName.push(data2[0].name);
              res.push({ ...data[i], catagoryName: catagoryName, tagName: tagName });
            }
          }
        }
      } else {
        for (let c = 0, len = catagory.length; c < len; c++) {
          const sql1 = DB.sqlQuery("SELECT * FROM `catagory` WHERE id = ?", [+catagory[c]]);
          const [err1, data1] = await Utils.awaitWrap(sql1);
          if (err1) {
            ctx.body = { code: status.SQL_ERR, msg: "生成分类名称失败" };
            return;
          } else {
            catagoryName.push(data1[0].name);
            for (let t = 0, len = tag.length; t < len; t++) {
              const sql2 = DB.sqlQuery("SELECT * FROM `tag` WHERE id = ?", [+tag[t]]);
              const [err2, data2] = await Utils.awaitWrap(sql2);
              if (err2) {
                ctx.body = { code: status.SQL_ERR, msg: "生成分类名称失败" };
                return;
              } else {
                tagName.push(data2[0].name);
                res.push({ ...data[i], catagoryName: catagoryName, tagName: tagName });
              }
            }
          }
        }
      }
    }
    ctx.body = { code: status.SUCCESS, data: res };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "查询失败" };
  }
});

router.get(partName + "/getArticleDetail", async ctx => {
  const { id } = ctx.query;
  let _sql;
  _sql = `SELECT * FROM article WHERE id = ?`;
  const promise = DB.sqlQuery(_sql, [id]);
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    ctx.body = { code: status.SUCCESS, data: data[0] };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "查询失败" };
  }
});

router.del(partName + "/delArticle", async ctx => {
  const promise = DB.sqlQuery("DELETE FROM `article` WHERE `id` = ?", [ctx.query.id]); /* 删 */
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    ctx.body = { code: status.SUCCESS, msg: "删除成功" };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "删除失败" };
  }
});

router.put(partName + "/putArticle", async ctx => {
  console.log(ctx.request.body);
  const { title, renderHtml, mdValue, tag, catagory, publicStatus, id } = ctx.request.body;
  const _sql = "UPDATE `article` SET `title` = ?,`renderHtml` = ?,`mdValue` = ?,`tag` = ?,`catagory` = ?,`publicStatus` = ? WHERE `id` = ?";
  const promise = DB.sqlQuery(_sql, [title, renderHtml, mdValue, tag, catagory, publicStatus, id]); /* 改 */
  const [err, data] = await Utils.awaitWrap(promise);
  if (!err) {
    ctx.body = { code: status.SUCCESS, msg: "更改成功" };
  } else {
    console.log(err);
    ctx.body = { code: status.SQL_ERR, msg: "更改失败" };
  }
});

module.exports = router;
