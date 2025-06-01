const { Router } = require("express");
const { getIndex,deleteMessage } = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", getIndex);
indexRouter.post("/:id/delete", deleteMessage)

module.exports = indexRouter;
