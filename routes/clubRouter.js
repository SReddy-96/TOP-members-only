const { Router } = require("express");
const { getClub } = require("../controllers/clubController");

const clubRouter = Router();

clubRouter.get("/", getClub);

module.exports = clubRouter;
