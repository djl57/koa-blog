const Koa = require("koa");
const cors = require("koa2-cors"); /* 跨域必需模块 */
const bodyParser = require("koa-bodyparser"); /* POST请求必需模块 */
const jwt = require("jsonwebtoken");
const Auth = require("./utils/auth");
const status = require("./interface/blog/config");

const app = new Koa();
app.use(cors());
app.use(bodyParser());

// const whiteList = ["/myblog/register", "/myblog/login"];

// app.use(async (ctx, next) => {
//   if (whiteList.includes(ctx.url)) {
//     await next();
//   } else {
//     if (ctx.header && ctx.header.authorization !== "null") {
//       const parts = ctx.header.authorization.split(" ");
//       if (parts.length === 2) {
//         const scheme = parts[0];
//         const token = parts[1];
//         if (/^Bearer$/i.test(scheme)) {
//           try {
//             //jwt.verify方法验证token是否有效
//             const decoded = await jwt.verify(token, Auth.secretOrPrivateKey);
//             await next();
//             ctx.body = { code: status.SUCCESS, data: decoded };
//           } catch (error) {
//             ctx.body = { code: status.NO_AUTH_B, msg: "登录已过期，请重新登录！" };
//           }
//         }
//       }
//     } else {
//       await next();
//     }
//   }
// });

const example01 = require("./interface/example01");
app.use(example01.routes());
app.use(example01.allowedMethods());

const blog = require("./interface/blog");
app.use(blog.routes());
app.use(blog.allowedMethods());

const exportWord = require("./interface/exportWord");
app.use(exportWord.routes());
app.use(exportWord.allowedMethods());

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
