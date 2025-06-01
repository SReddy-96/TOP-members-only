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
      const { user } = req;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("admin", {
          title: "Admin Sign in ",
          errors: errors.array(),
        });
      }
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
  res.render("admin", { title: "Admin Sign in" });
};

module.exports = {
  getAdmin,
  postAdmin,
};
