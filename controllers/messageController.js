const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const notEmptyErr = "must not be empty";

const validateMessage = [
  body("message").trim().notEmpty().withMessage(`Message ${notEmptyErr}`),
];

const getMessage = (req, res) => {
  res.render("newMessage", { title: "New Message" });
};

const postMessage = [
  validateMessage,
  async (req, res, next) => {
    try {
      const { message } = req.body;
      const { user } = req;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("newMessage", {
          title: "New Message",
          errors: errors.array(),
        });
      }
      await db.insertMessage(message, user);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];

module.exports = { getMessage, postMessage };
