const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { Validate, route } = require("./MiddleWare");
const pool = require("./DataBaseconfig");

const router = express.Router();

const RegisterSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

router.post("/", Validate(RegisterSchema), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const usernameResult = await pool.query(
      "SELECT * From users WHERE username=$1",
      [username],
    );

    if (usernameResult.rows.length > 0) {
      return res.status(400).json({ message: "username already exist" });
    }

    const emailResult = await pool.query("SELECT * From users WHERE email=$1", [
      email,
    ]);

    if (emailResult.rows.length > 0) {
      return res.status(400).json({ message: "email already exist" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username,email,password) VALUES ($1,$2,$3)",
      [username, email, passwordHash],
    );
    res.status(400).json({ message: "registration succesfull" });
  } catch (err) {
    res.json("error occured during registration");
  }
});
module.exports = router;
