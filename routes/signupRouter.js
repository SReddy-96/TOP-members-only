const { Router } = require("express");
const { getSignup, postSignup } = require("../controllers/signupController");

const signupRouter = Router();

signupRouter.get("/", getSignup);
signupRouter.post("/", postSignup);

module.exports = signupRouter;
