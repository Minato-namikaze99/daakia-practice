const Joi = require("joi");
const initModels = require("../models/init-models").initModels;
// const { where, Op } = require("sequelize");
const { Sequelize, where } = require("sequelize");
const { sqlize } = require("../config/dbconfig");
const { generateAccessToken } = require("../middleware/jwtAuth");
//this import is for JOI validation

const crypto = require('crypto');
//for password storing, for hashing and all

const models = initModels(sqlize);

module.exports = {
  login: async (req, res) => {
    const userDetails = req.body;

    const user = await models.User.findOne({ //gets the id of the user with the same country_code and phone_number
      attribute: ['id', 'salt', 'hash'],
      where: {
        country_code: userDetails.country_code,
        phone_number: userDetails.phone_number,
      },
    });

    if (user === null) { //if no user is found, it means that no user exists, thus displaying appropriate message 
      return res
        .status(403)
        .json({ message: "User with these credentials does not exist" });
    }
    const newHash = crypto.pbkdf2Sync(userDetails.password, user.salt, 10000, 16, 'sha512').toString('hex');

    if (newHash !== user.hash)
      return res
        .status(403)
        .json({ message: "Wrong password!" });

    const accessUser = {
      id: user.id,
    };

    const accessToken = generateAccessToken(accessUser); //generates a jwt token based on the id of the user

    return res
      .status(200)
      .json({ message: "Login successful!", accessToken: accessToken });
  },
  register: async (req, res) => {
    const userDetails = req.body;

    models.User.findOne({ //gets an id of the user with the same country_code and phone_number
      attribute: ['id'],
      where: {
        country_code: userDetails.country_code,
        phone_number: userDetails.phone_number,
      },
    })
      .then((user) => { //if we get some id, it means that the number is already registered, thus, displaying appropriate message
        if (user) {
          return res.status(409).json({ message: "User already exists!" });
        } else {

          const _salt = crypto.randomBytes(8).toString('hex');
          const _hash = crypto.pbkdf2Sync(userDetails.password, _salt, 10000, 16, 'sha512').toString('hex');

          console.log(_salt);
          console.log(_hash);

          models.User.create({
            country_code: userDetails.country_code,
            phone_number: userDetails.phone_number,
            name: userDetails.name,
            address: userDetails.address,
            dob: userDetails.dob,
            gender: userDetails.gender,
            salt: _salt,
            hash: _hash,
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
      const todoID = req.params.todoId;
      const currentUser = req.user;

      models.Todo.findOne({ where: { id: todoID, user_id: currentUser.id } })
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
  deleteTodoByID: async (req, res) => {
    try {
      const todoID = req.params.todoId;
      const currentUser = req.user;

      models.Todo.findOne({ where: { id: todoID, user_id: currentUser.id } })
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