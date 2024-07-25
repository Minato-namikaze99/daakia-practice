const express = require("express");
const router = express.Router();
const todoController = require("../../controllers/todoController");
const { Todo } = require("../../models/Todo");
const { User } = require("../../models/User");

router.post("/register", todoController.register);


router.get("/todos", todoController.getAllTodos);
router.get("/todos/done", todoController.getDoneTodos);
router.get("/todos/undone", todoController.getUndoneTodos);
router.get("/todos/:deadline", todoController.getTodosOnOrBeforeDeadline);
    
router.post("/todos", todoController.createTodo);

router.put("/todos/:todoId/done", todoController.markTodoAsDone);

router.delete("/todos/:todoId", todoController.deleteTodoByID);

// todoController.setupAssociations({ User, Todo });

module.exports = router;