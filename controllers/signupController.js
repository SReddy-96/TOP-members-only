const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

// get request
// show signup form
// don't show if already logged in
const getSignup = async (req, res) => {
  res.render("signup", { title: "signup" });
};

// post request
// Should insert the data into the table
// check to see if the username exists already and throw error
// validate and sanitise
// remember to hash + salt password with bcrypt.

const postSignup = async (req, res, next) => {
  try {
    const { first_name, last_name, username, password } = req.body;
    // const usernameCheck = await db.getUserByUsername(username);
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insertUser(first_name, last_name, username, hashedPassword);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  getSignup,
  postSignup,
};
