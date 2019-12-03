const status = {
  SUCCESS: "200",
  NET_ERR: "201", // 网络连接异常
  PARAMS_A: "202", // 参数缺少
  PARAMS_B: "203", // 参数结构错误，用户输入有误
  NO_AUTH_A: "204", // 未经授权的请求，token生成失败
  NO_AUTH_B: "205", // 令牌失效
  BIZ_ERR: "206", // 业务请求异常
  SQL_ERR: "207" // 数据库操作异常
};

module.exports = status;
