const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const notEmptyErr = "must not be empty";

const validateAdmin = [
  body("admin_password")
    .trim()
    .notEmpty()
    .withMessage(`Admin password ${notEmptyErr}`),
];

// get admin
const postAdmin = [
  validateAdmin,
  async (req, res, next) => {
    try {
      const { admin_password } = req.body;

      // check if user is logged in
      const { user } = req;
      if (!user) {
        return res.status(400).render("admin", {
          title: "Admin Sign in ",
          errors: [{ msg: "Please log in first" }],
        });
      }

      // Check password validate and sanitise
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("admin", {
          title: "Admin Sign in ",
          errors: errors.array(),
        });
      }

      // check password
      if (admin_password === process.env.ADMIN_PASSWORD) {
        await db.toggleAdmin(user.id);
        res.redirect("/");
      } else {
        return res.status(400).render("admin", {
          title: "Admin Sign in",
          errors: [{ msg: "Incorrect Admin Password" }],
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];

const getAdmin = (req, res) => {
  const { user } = req;
  if (user.admin) {
    res.redirect("/");
  } else {
    res.render("admin", { title: "Admin Sign in" });
  }
};

module.exports = {
  getAdmin,
  postAdmin,
};
