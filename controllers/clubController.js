const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const notEmptyErr = "must not be empty";

const validatePre = [
  body("club_password")
    .trim()
    .notEmpty()
    .withMessage(`Club Premium Password ${notEmptyErr}`),
];

const getClub = async (req, res) => {
  // show member form if no premium_member
  // if true, then don't show the page or link in header.
  res.render("club", { title: "Premium Member" });
};

// post request takes a secret password in .env and if it matches then change premium_member to true
// check if user is premium already
const postClub = [
  validatePre,
  async (req, res, next) => {
    try {
      const { club_password } = req.body;
      const { user } = req;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("club", {
          title: "Premium Club",
          errors: errors.array(),
        });
      }

      if (club_password === process.env.CLUB_PASSWORD) {
        await db.toggleClub(user.id);
        res.redirect("/");
      } else {
        return res.status(400).render("club", {
          title: "Premium Club",
          errors: [{ msg: "Incorrect Club Password" }],
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];

module.exports = {
  getClub,
  postClub,
};
