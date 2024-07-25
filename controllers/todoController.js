const Joi = require("joi");
const { Todo } = require("../models/Todo");
const { User } = require("../models/User");
// const { where, Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const { sqlize } = require("../config/dbconfig");

// User.hasMany(Todo);
// Todo.belongsTo(User);

module.exports = {
  register: async (req, res) => {
    const schema = Joi.object({
      country_code: Joi.string().pattern(new RegExp("^[0-9]+$")).min(1).max(6).required(),
      phone_number: Joi.string().pattern(new RegExp("^[0-9]+$")).min(8).max(12).required(),
      name: Joi.string().max(100).required(),
      address: Joi.string().max(200).required(),
      dob: Joi.date().required(),
      gender: Joi.string().max(50).required(),
    });

    let validationError = schema.validate(req.body);

    if (validationError.error && validationError.error !== null) {
      return res.status(400).json(validationError.error);
    }

    const userDetails = req.body;

    try {
      const [results, metadata] = await sqlize.query('SELECT COUNT(*) AS count FROM user WHERE CONCAT(country_code, phone_number) = ?', {
        replacements: ['${userDetails.country_code}${userDetails.phone_number}'],
        type: sqlize.QueryTypes.SELECT,
      });
      console.log(results);
      if (results.count > 0) return res.status(400).json('User already exists');
      console.log(results.count > 0);

      console.log(userDetails);

      await User.create({
        country_code: userDetails.country_code,
        phone_number: userDetails.phone_number,
        name: userDetails.name,
        address: userDetails.address,
        dob: userDetails.dob,
        gender: userDetails.gender
      });
      res.status(201).json({ message: "New user created!" });
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  },


  createTodo: async (req, res) => {
    try {
      let schema = Joi.object({
        note: Joi.string().pattern(new RegExp("[a-zA-Z0-9s]")).required(),
        done: Joi.boolean().required(),
        deadline: Joi.date(),
      });

      let validationError = schema.validate(req.body);

      if (validationError.error && validationError.error !== null) {
        return res.status(400).json(validationError.error);
      }

      const todo = req.body;

      await Todo.create({
        note: todo.note,
        done: todo.done,
        deadline: todo.deadline || null,
      });

      res.status(201).json({ message: "New todo created!" });
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },
  getAllTodos: async (req, res) => {
    try {
      const allTodos = await Todo.findAll();
      res.status(200).json({ data: allTodos });
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },
  getUndoneTodos: async (req, res) => {
    try {
      const allUndoneTodos = await Todo.findAll({ where: { done: false } });
      res.status(200).json({ data: allUndoneTodos });
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },
  getDoneTodos: async (req, res) => {
    try {
      const allDoneTodos = await Todo.findAll({ where: { done: true } });
      res.status(200).json({ data: allDoneTodos });
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },
  getTodosOnOrBeforeDeadline: async (req, res) => {
    try {
      let schema = Joi.object({
        deadline: Joi.date().required(),
      });

      let validationError = schema.validate(req.params);

      if (validationError.error && validationError.error !== null) {
        return res.status(400).json(validationError.error);
      }

      const date = req.params.deadline;

      const todos = await Todo.findAll({
        where: {
          deadline: {
            [Op.lte]: date,
          },
        },
      });

      res.status(200).json({ data: todos });
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },
  markTodoAsDone: async (req, res) => {
    try {
      let schema = Joi.object({
        todoId: Joi.number().required(),
      });

      let validationError = schema.validate(req.params);

      if (validationError.error && validationError.error !== null) {
        return res.status(400).json(validationError.error);
      }

      const todoID = req.params.todoId;

      await Todo.update(
        { done: true },
        {
          where: {
            id: todoID,
          },
        }
      );

      res.status(200).json({ message: "Todo updated!" });
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },
  deleteTodoByID: async (req, res) => {
    try {
      let schema = Joi.object({
        todoId: Joi.number().required(),
      });

      let validationError = schema.validate(req.params);

      if (validationError.error && validationError.error !== null) {
        return res.status(400).json(validationError.error);
      }

      const todoID = req.params.todoId;

      await Todo.destroy({
        where: {
          id: todoID,
        },
      });

      res.status(200).json({ message: "Todo deleted!" });
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },
};

// module.exports.setupAssociations = (db) => {
//   db.User.hasMany(db.Todo, {
//     foreignKey: 'user_id',
//     as: 'todos'
//   });

//   db.Todo.belongsTo(db.User, {
//     foreignKey: 'id',
//     as: 'user'
//   });
// };
