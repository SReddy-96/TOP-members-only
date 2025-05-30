const passport = require("passport");
const { body, validationResult } = require("express-validator");

const notEmptyErr = "must not be empty";

const validateUser = [
  body("username").trim().notEmpty().withMessage(`Username ${notEmptyErr}`),
  body("password").trim().notEmpty().withMessage(`Password ${notEmptyErr}`),
];

// get login form
const getLogin = async (req, res) => {
  const passportErrors = req.flash("error").map((msg) => ({ msg }));
  res.render("login", {
    title: "Login",
    errors: passportErrors,
  });
};

// post request
const postLogin = [
  validateUser,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        title: "Login",
        errors: errors.array(),
      });
    }
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
];

module.exports = {
  getLogin,
  postLogin,
};
