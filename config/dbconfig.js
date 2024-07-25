const Sequelize = require("sequelize");
exports.sqlize = new Sequelize(
 process.env.db_name,
 process.env.db_username,
 process.env.db_password,
  {
    host: process.env.db_host,
    dialect: 'mysql'
  }
);