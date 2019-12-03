const mysql = require("mysql");
const Config = require("./config");

class DB {
  constructor() {
    this.connection = "";
    this.connect();
  }
  connect() {
    return new Promise((resolve, reject) => {
      if (this.connection) {
        resolve(this.connection);
      } else {
        const connection = mysql.createConnection(Config);
        connection.connect(err => {
          if (err) {
            console.log("数据库连接失败：", err);
          } else {
            console.log("数据库连接成功，连接id为：", connection.threadId);
            this.connection = connection;
            resolve(connection);
          }
        });
      }
    });
  }
  sqlQuery(sqlString, values) {
    return new Promise((resolve, reject) => {
      this.connect().then(connection => {
        connection.query(sqlString, values, (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    });
  }
}

module.exports = new DB();
