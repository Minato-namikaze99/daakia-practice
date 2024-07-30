const Joi = require("joi");
const initModels = require("../models/init-models").initModels;
const { Sequelize, where } = require("sequelize");
const { sqlize } = require("../config/dbconfig");
const { generateAccessToken } = require("../utilities/jwtAuth");
const { registrationSchema, loginSchema, createTodoSchema, markTodoAsDoneSchema, deleteTodoByIDSchema } = require("../utilities/middleware")
//this import is for JOI validation

const models = initModels(sqlize);

module.exports = {
  login: async (req, res) => {
    let validationError = loginSchema.validate(req.body); //validates the login data

    if (validationError.error && validationError.error !== null) {
      return res.status(400).json(validationError.error); //shows the validation errors
    }

    const userDetails = req.body;

    const user = await models.User.findOne({ //finds the ID of the user with the same country code and phone number
      attributes: ['id'],
      where: {
        country_code: userDetails.country_code,
        phone_number: userDetails.phone_number,
      },
    });

    if (user === null) { //shows an error message when there is no user with the credentials provided
      return res
        .status(403)
        .json({ message: "User with these credentials does not exist" });
    }

    const accessUser = {
      id: user.id, //gets the ID
    };

    const accessToken = generateAccessToken(accessUser); //generates a JWT token with the ID of the user

    return res
      .status(200)
      .json({ message: "Login successful!", accessToken: accessToken }); //displays a message when the login is successful
  },


  register: async (req, res) => { //registers an user
    let validationError = registrationSchema.validate(req.body); //validates the login data

    if (validationError.error && validationError.error !== null) {
      return res.status(400).json(validationError.error); //shows the validation errors
    }

    const userDetails = req.body;

    models.User.findOne({ //finds the ID of the user with the same country code and phone number
      attributes: ['id'],
      where: {
        country_code: userDetails.country_code,
        phone_number: userDetails.phone_number,
      },
    })
      .then((user) => {
        if (user) {
          return res.status(409).json({ message: "User already exists!" }); //displays an error message if an user does exist
        } else {
          models.User.create({ //if the same user does not exist, we succesfully register the user
            country_code: userDetails.country_code,
            phone_number: userDetails.phone_number,
            name: userDetails.name,
            address: userDetails.address,
            dob: userDetails.dob,
            gender: userDetails.gender,
          })
            .then(() => {
              return res.status(201).json({ message: "New user created!" }); //displays a message when the user is registered
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


  createTodo: async (req, res) => { //creates todos
    try {
      let validationError = createTodoSchema.validate(req.body); //validates the create todo data

      if (validationError.error && validationError.error !== null) {
        return res.status(400).json(validationError.error); //shows the validation errors
      }

      const todo = req.body;
      const currentUser = req.user;

      await models.Todo.create({ //creates a todo
        title: todo.title,
        status: todo.status,
        user_id: currentUser.id,
      });

      res.status(201).json({ message: "New todo created!" }); //displays a message when the todo is created succesfully
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },


  getAllTodos: async (req, res) => { //gets todos
    try {
      const currentUser = req.user;
      const allTodos = await models.Todo.findAll({ //gets all the todos of a user
        where: { user_id: currentUser.id },
      });
      res.status(200).json({ data: allTodos });
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },


  getUndoneTodos: async (req, res) => { //gets the todos which are marked as undone by the user
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


  getDoneTodos: async (req, res) => { //gets the todos which are marked as done by the user
    try {
      const allDoneTodos = await models.Todo.findAll({
        where: { status: true, user_id: currentUser.id },
      });
      res.status(200).json({ data: allDoneTodos });
    } catch (error) {
      res.status(500).json({ message: "Some error occured!", error });
    }
  },


  markTodoAsDone: async (req, res) => { //allows us to mark a todo as done by the user
    try {
      let validationError = markTodoAsDoneSchema.validate(req.params); //validates the necessary fields

      if (validationError.error && validationError.error !== null) {
        return res.status(400).json(validationError.error); //shows the validation errors
      }

      const todoID = req.params.todoId;
      const currentUser = req.user;

      models.Todo.findOne({ where: { id: todoID, user_id: currentUser.id } }) //gets the ID of the todo
        .then((data) => {
          if (data === null) {
            return res.status(403).json({ message: "Access forbidden!" });
          }

          models.Todo.update(
            { status: true },
            {
              where: {
                id: todoID,
              },
            }
          )
            .then(() => {
              return res.status(201).json({ message: "Todo updated!" });
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


  deleteTodoByID: async (req, res) => { //gives us an option to delete a todo by the user
    try {
      let validationError = deleteTodoByIDSchema.validate(req.params); //validate the necessary fields

      if (validationError.error && validationError.error !== null) {
        return res.status(400).json(validationError.error); //shows the validation errors
      }

      const todoID = req.params.todoId;
      const currentUser = req.user;

      models.Todo.findOne({ where: { id: todoID, user_id: currentUser.id } }) //finds the ID of the todo
        .then((data) => {
          if (data === null)
            return res.status(403).json({ message: "Access forbidden!" });

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