const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const Register = require("./Register");
const Login = require("./Login");

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Register routes
app.use("/register", Register);
app.use("/login", Login);

const port = 3000;
app.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});
