const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const Register = require("./Register");
const Login = require("./Login");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use("/", Login);
app.use("/register", Register);

const port = 3000;
app.listen(port, () => {
  console.log(`The server is running on port:${port}`);
});
