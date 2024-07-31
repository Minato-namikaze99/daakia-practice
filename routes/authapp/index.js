const express = require("express");
const router = express.Router();
const todoController = require("../../controllers/todoController");

const { validate } = require("../../middleware/validator"); //validator is present here
const schema = require("./schema"); //joi schema for endpoints involved for authorisation

router.post("/user/login", validate(schema.loginUser), todoController.login);
router.post("/user/register", validate(schema.registerUser), todoController.register);

module.exports = router;