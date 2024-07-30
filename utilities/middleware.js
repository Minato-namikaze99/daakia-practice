const Joi = require("joi");

const registrationSchema = Joi.object({ //schema of the registration endpoint
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

const loginSchema = Joi.object({ //schema of the login endpoint
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
});

const createTodoSchema = Joi.object({ //schema of the createTodo endpoint
    title: Joi.string().pattern(new RegExp("[a-zA-Z0-9s]")).required(),
    status: Joi.boolean().required(),
});

const markTodoAsDoneSchema = Joi.object({ //schema of the markTodoAsDone endpoint
    todoId: Joi.number().required(),
});

const deleteTodoByIDSchema = Joi.object({ //schema of the deleteTodoByID endpoint
    todoId: Joi.number().required(),
});


module.exports = {
    registrationSchema,
    loginSchema,
    createTodoSchema,
    markTodoAsDoneSchema,
    deleteTodoByIDSchema
};