const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { Validate, route } = require("./MiddleWare");
const pool = require("./DatabaseConfig");

const router = express.Router();

const loginSchema = z.object({
  login: z.union([z.string().email(), z.string().min(3)]),//either email or username
  password: z.string().min(8),
});

router.post("/login", Validate(loginSchema), async (req, res) => {
  try {
    const { login, password } = req.body;

    let result;
    if (login.includes("@")) {
      result = await pool.query("SELECT * FROM users WHERE email=$1", [login]);
    } else {
      result = await pool.query("SELECT * FROM users WHERE username=$1", [login]);

    }


    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ "user does not exist"});

    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ "wrong password"});

    }

    const token = jwt.sign(
      {
        username: user.username,
      },
      "YourSecretKey", // Replace with your actual secret key
      { expiresIn: '1h' } // Optional: set an expiration time for the token
    );


    res.json({ token });

  } catch (err) {
    res.status(400).json("error occured during login");
  }
});

module.exports = router;
