var DataTypes = require("sequelize").DataTypes;
var _Todo = require("./Todo");
var _Todos = require("./Todos");
var _User = require("./User");

function initModels(sequelize) {
  var Todo = _Todo(sequelize, DataTypes);
  var Todos = _Todos(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);

  Todo.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(Todo, { as: "todos", foreignKey: "user_id"});

  return {
    Todo,
    Todos,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
