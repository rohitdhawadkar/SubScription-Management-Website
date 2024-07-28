const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { Validate } = require("./MiddleWare");
const pool = require("./DataBaseconfig");

const router = express.Router();

const loginSchema = z.object({
  login: z.union([z.string().email(), z.string().min(3)]), // Either email or username
  password: z.string().min(8),
});

router.post("/", Validate(loginSchema), async (req, res) => {
  try {
    const { login, password } = req.body;

    let result;
    if (login.includes("@")) {
      result = await pool.query("SELECT * FROM users WHERE email=$1", [login]);
    } else {
      result = await pool.query("SELECT * FROM users WHERE username=$1", [
        login,
      ]);
    }

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        username: user.username,
      },
      "mumbai2002",
      { expiresIn: "1h" },
    );

    res.json({ token });
  } catch (err) {
    console.error("Error occurred during login:", err);
    res.status(500).json({ message: "Error occurred during login" });
  }
});

module.exports = router;
