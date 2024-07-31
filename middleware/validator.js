const _ = require('lodash');

/**
 * @public
 * @description To generate schema validation fail error message
 * @returns {Object}
 */
exports.getValidationErrorMessage = (error) => {
  return error.details.map(({ message }) => ({
    message: message.replace(/['"]/g, ''),
  }))[0];
};

/**
 * @private
 * @description To extract data from request
 * @param {Object} schema holds the schema to validate
 * @param {Object} req holds the request from client
 */
exports.extractor = (req, schema) => {
  const data = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const property of ['params', 'body', 'query']) {
    if (!_.isEmpty(req[property])) {
      data[property] = req[property];
    } else if (schema[property]) {
      data[property] = {};
    }
  }
  return data;
};

/**
 * @private
 * @description To assign validated data to request
 * @param {Object} body holds the request body
 * @param {Object} query holds the request query string
 * @param {Object} params holds the request query parameters
 * @param {Object} req holds the request from client
 */
exports.assigner = ({ body, query, params }, req) => {
  if (body) {
    req.body = body;
  }
  if (query) {
    req.query = query;
  }
  if (params) {
    req.params = params;
  }
};

/**
 * @public
 * @description To validate request from client
 * @param {Object} schema holds the schema to validate
 * @param {Object} req holds the request from client
 * @returns {Object}
 */
const validate = (schema, req, res, next) => {
  // Extract request data
  const data = this.extractor(req, schema);
  // Validate request
  console.log(data);
  const { error, value: validatedData } = schema.validate(data.body, {
    stripUnknown: { objects: true },
  });

  if (error) {
    return res.status(400).send({
      status: "Error: Fail!",
      success: 0,
      code: "Bad Request",
      message: this.getValidationErrorMessage(error).message,
    });
  }
  // Replace req with the valid data after validation
  this.assigner(validatedData, req);
  console.log("validator");
  next();
};

// Initialize validator
exports.validate = (schema) => (req, res, next) =>
  validate(schema, req, res, next);