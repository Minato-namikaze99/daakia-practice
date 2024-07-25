const { Model, DataTypes } = require("sequelize");
const { sqlize } = require("../config/dbconfig");

exports.Users = sqlize.define(
  "Users",
  { //the table constraints and all
    country_code: { type: DataTypes.STRING, unique: false, allowNull: false, },
    phone_number: { type: DataTypes.STRING, unique: true, allowNull: false, },
    name: { type: DataTypes.STRING, unique: false, allowNull: true, },
    address: { type: DataTypes.STRING, unique: false, allowNull: true, },
    dob: { type: DataTypes.DATE, unique: false, allowNull: true, },
    gender: { type: DataTypes.STRING, unique: false, allowNull: true, },
  },
  {
    sqlize,
    tableName: "user",
    createdAt: false,
    updatedAt: false,
  }
);