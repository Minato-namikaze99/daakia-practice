const express = require("express");
const router = express.Router();
const todoController = require("../../controllers/todoController");

const { authenticateToken } = require("../../middleware/jwtAuth"); //jwt authorisation

const { validate } = require("../../middleware/validator"); //validator
const schema = require("./schema");

router.use(authenticateToken);

router.get("/todos", todoController.getAllTodos); //gets all the todos created by a user

router.get("/todos/done", todoController.getDoneTodos); //gets all the todos which are marked as done by the user

router.get("/todos/undone", todoController.getUndoneTodos); //gets all the todos which are marked as undone/not done by the user

router.post("/todos", validate(schema.createTodo), todoController.createTodo); //validates and then creates a todo

router.put("/todos/:todoId/done", validate(schema.markTodoAsDone), todoController.markTodoAsDone); //validates and then markes a todo as done by their ID

router.delete("/todos/:todoId", validate(schema.deleteTodoByID), todoController.deleteTodoByID); //validates and then deletes a todo by their ID


module.exports = router;