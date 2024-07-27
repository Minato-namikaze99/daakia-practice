const { Model, DataTypes } = require('sequelize');
const { sqlize } = require("../config/dbconfig");

exports.User = sqlize.define('User', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  country_code: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  address: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  sqlize,
  tableName: 'user',
  createdAt: false,
  updatedAt: false,
});
