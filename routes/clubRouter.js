const { Router } = require("express");
const { getClub, postClub } = require("../controllers/clubController");

const clubRouter = Router();

clubRouter.get("/", getClub);
clubRouter.post("/", postClub);

module.exports = clubRouter;
