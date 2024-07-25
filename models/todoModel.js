const { Model, DataTypes, DatabaseError } = require("sequelize");
const { sqlize } = require("../config/dbconfig");

exports.Todo = sqlize.define(
  "Todo",
  {
    note: { type: DataTypes.STRING, unique: true , allowNull: false, },
    done: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false, },
    deadline: { type: DataTypes.DATEONLY },
  },
  {
    sqlize,
    tableName: "todos",
    createdAt: false,
    updatedAt: false,
  }
);
