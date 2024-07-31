const Joi = require("joi");

exports.loginUser = Joi.object({ //Joi schema for login
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

exports.registerUser = Joi.object({ //joi schema for register
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