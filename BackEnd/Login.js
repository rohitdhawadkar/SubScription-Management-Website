const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { Validate, route } = require("./MiddleWare");
const pool = require("./DatabaseConfig");

const router = express.Router();

const loginSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
});

router.post("/login", Validate(loginSchema), async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);

    const user = result.rows[0];

    if (!user) {
      res.status(400).json({ "user does not exist"});

    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!password) {
      res.status(400).json({ "wrong password"});

    }

    const token = jwt.sign({
      UserId: user.id,
      username: user.username
    }, Mumbai2002);

    res.json({ token });

  } catch (err) {
    res.status(400).json("error occured during login");
  }
});

module.exports = router;
