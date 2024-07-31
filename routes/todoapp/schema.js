const Joi = require("joi");

exports.createTodo = Joi.object({ //joi schema for creating a todo
  title: Joi.string().pattern(new RegExp("[a-zA-Z0-9s]")).required(),
  status: Joi.boolean().required(),
});

exports.markTodoAsDone = Joi.object({ //joi schema for marking a todo as done by their todoID
  todoId: Joi.number().required(),
});

exports.deleteTodoByID = Joi.object({ //joi schema for deleting a todo by their todoID
  todoId: Joi.number().required(),
});
