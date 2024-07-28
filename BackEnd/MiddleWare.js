const { z } = require("zod");

const Validate = (schema) => {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Invalid request body", errors: err.errors });
    }
  };
};

module.exports = {
  Validate,
};
