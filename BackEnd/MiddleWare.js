const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");

const router = express.Router();

const Validate = (schema) => {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: "request body is required" });
    }

    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      return res
        .status(400)
        .json({ message: "invalid request body", errors: err.errors });
    }
  };
};
module.exports = {
  router,
  Validate,
};
