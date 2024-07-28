const express = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { Validate } = require("./MiddleWare");
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
      "SELECT * FROM users WHERE username=$1",
      [username],
    );

    if (usernameResult.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const emailResult = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (emailResult.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, passwordHash],
    );

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Error occurred during registration:", err);
    res.status(500).json({ message: "Error occurred during registration" });
  }
});

module.exports = router;
