const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const notEmptyErr = "must not be empty";
const lengthErr = "must be between 2 and 30 characters.";

const validateUser = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage(`First Name ${notEmptyErr}`)
    .isAlpha()
    .withMessage(`First Name ${alphaErr}`)
    .isLength({ min: 2, max: 30 })
    .withMessage(`First name ${lengthErr}`),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage(`Last Name ${notEmptyErr}`)
    .isAlpha()
    .withMessage(`Last Name ${alphaErr}`)
    .isLength({ min: 2, max: 30 })
    .withMessage(`Last name ${lengthErr}`),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`username ${notEmptyErr}`)
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters.")
    .matches(/^[a-zA-Z0-9_.-]+$/) // Recommended: Allow letters, numbers, underscore, dot, hyphen
    .withMessage(
      "Username can only contain letters, numbers, underscores, dots, and hyphens."
    )
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
    .isLength({ min: 8 })
    .withMessage("Password must be over 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage(`Confirm Password ${notEmptyErr}`)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        // Changed to check for inequality
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
];

// get request
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
