const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const notEmptyErr = "must not be empty";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("first_name")
    .trim()
    .isAlpha()
    .withMessage(`First Name ${alphaErr}`)
    .notEmpty()
    .withMessage(`First Name ${notEmptyErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("last_name")
    .trim()
    .isAlpha()
    .withMessage(`First Name ${alphaErr}`)
    .notEmpty()
    .withMessage(`Last Name ${notEmptyErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`username ${notEmptyErr}`)
    .custom(async (value) => {
      const user = await db.getUserByUsername(value);
      if (user) {
        throw new Error("Username already in use");
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`password ${notEmptyErr}`)
    .isLength({ min: 5 })
    .withMessage("Password must be over 5 characters"),
  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      // Changed to check for inequality
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
];

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

const postSignup = [
  validateUser,
  async (req, res, next) => {
    try {
      const { first_name, last_name, username, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("signup", {
          title: "Signup",
          errors: errors.array(),
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.insertUser(first_name, last_name, username, hashedPassword);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];

module.exports = {
  getSignup,
  postSignup,
};
