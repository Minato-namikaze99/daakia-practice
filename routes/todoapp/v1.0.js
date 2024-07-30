const express = require("express");
const router = express.Router();
const todoController = require("../../controllers/todoController");
// const { Todo } = require("../../models/Todo");
// const { User } = require("../../models/User");
const { authenticateToken } = require("../../utilities/jwtAuth");
const { validateData } = require("../../utilities/middleware");

// endpoints

router.post("/user/login", todoController.login); //login into the app
router.post("/user/register", todoController.register); //register into the app

router.use(authenticateToken); //authenticates JWT at each endpoint after this

router.get("/todos", todoController.getAllTodos); //gets all the todos of a user
router.get("/todos/done", todoController.getDoneTodos); //gets the todos which are marked as done by the user
router.get("/todos/undone", todoController.getUndoneTodos); //gets the todos which are marked as not done by the user

router.post("/todos", todoController.createTodo); //creates a todo 

router.put("/todos/:todoId/done", todoController.markTodoAsDone); //edits a todo by todoID and marks it as done

router.delete("/todos/:todoId", todoController.deleteTodoByID); //deletes a todo by todoID

// todoController.setupAssociations({ User, Todo });

module.exports = router;