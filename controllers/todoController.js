const Joi = require("joi");
const initModels = require("../models/init-models").initModels;
const { Sequelize, where } = require("sequelize");
const { sqlize } = require("../config/dbconfig");
const { generateAccessToken } = require("../middleware/jwtAuth");

// User.hasMany(Todo);
// Todo.belongsTo(User);

const models = initModels(sqlize);

module.exports = {
  login: async (req, res) => {
    const schema = Joi.object({
      country_code: Joi.string()
        .pattern(new RegExp("^[0-9]+$"))
        .min(1)
        .max(6)
        .required(),
      phone_number: Joi.string()
        .pattern(new RegExp("^[0-9]+$"))
        .min(8)
        .max(12)
        .required(),
      name: Joi.string().max(100).required(),
    });

    let validationError = schema.validate(req.body);

    if (validationError.error && validationError.error !== null) {
      return res.status(400).json(validationError.error);
    }

    const userDetails = req.body;

    const user = await models.User.findOne({
      where: {
        name: userDetails.name,
        country_code: userDetails.country_code,
        phone_number: userDetails.phone_number,
      },
    });

    if (user === null) {
      return res
        .status(403)
        .json({ message: "User with these credentials does not exist" });
    }

    const accessUser = {
      id: user.id,
    };

    const accessToken = generateAccessToken(accessUser);

    return res
      .status(200)
      .json({ message: "Login successful!", accessToken: accessToken });
  },


  register: async (req, res) => {
    const schema = Joi.object({
      country_code: Joi.string()
        .pattern(new RegExp("^[0-9]+$"))
        .min(1)
        .max(6)
        .required(),
      phone_number: Joi.string()
        .pattern(new RegExp("^[0-9]+$"))
        .min(8)
        .max(12)
        .required(),
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

    models.User.findOne({
      where: {
        country_code: userDetails.country_code,
        phone_number: userDetails.phone_number,
      },
    })
      .then((user) => {
        if (user) {
          return res.status(409).json({ message: "User already exists!" });
        } else {
          models.User.create({
            country_code: userDetails.country_code,
            phone_number: userDetails.phone_number,
            name: userDetails.name,
            address: userDetails.address,
            dob: userDetails.dob,
            gender: userDetails.gender,
          })
            .then(() => {
              return res.status(201).json({ message: "New user created!" });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },


  createTodo: async (req, res) => {
    try {
      let schema = Joi.object({
        title: Joi.string().pattern(new RegExp("[a-zA-Z0-9s]")).required(),
        status: Joi.boolean().required(),
      });

      let validationError = schema.validate(req.body);

      if (validationError.error && validationError.error !== null) {
        return res.status(400).json(validationError.error);
      }

      const todo = req.body;
      const currentUser = req.user;

      await models.Todo.create({
        title: todo.title,
        status: todo.status,
        user_id: currentUser.id,
      });

      res.status(201).json({ message: "New todo created!" });
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },


  getAllTodos: async (req, res) => {
    try {
      const currentUser = req.user;
      const allTodos = await models.Todo.findAll({
        where: { user_id: currentUser.id },
      });
      res.status(200).json({ data: allTodos });
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },


  getUndoneTodos: async (req, res) => {
    try {
      const currentUser = req.user;
      const allUndoneTodos = await models.Todo.findAll({
        where: { status: false, user_id: currentUser.id },
      });
      res.status(200).json({ data: allUndoneTodos });
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },


  getDoneTodos: async (req, res) => {
    try {
      const allDoneTodos = await models.Todo.findAll({
        where: { status: true, user_id: currentUser.id },
      });
      res.status(200).json({ data: allDoneTodos });
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
      const currentUser = req.user;

      models.Todo.findOne({ where: { id: todoID, user_id: currentUser.id } })
      .then((data) => {
        if(data === null)
        {
          return res.status(403).json({message: "Access forbidden!"});
        }

        models.Todo.update(
          { status: true },
          {
            where: {
              id: todoID,
            },
          }
        )
        .then(()=>{
          return res.status(201).json({message: "Todo updated!"});
        })
        .catch((error) => {
          console.log(error);
        })
      })
      .catch((error) => {
        console.log(error);
      })

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
      const currentUser = req.user;

      models.Todo.findOne({where: {id: todoID, user_id: currentUser.id}})
      .then((data) => {
        if(data === null)
          return res.status(403).json({message: "Access forbidden!"});
        
        models.Todo.destroy({
          where: {
            id: todoID,
          },
        });
        return res.status(200).json({ message: "Todo deleted!" });
      })
      .catch((error) => {
        console.log(error);
      })
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
