const { Router } = require("express");
const { getMessage, postMessage } = require("../controllers/messageController");

const messageRouter = Router();

messageRouter.get("/", getMessage);
messageRouter.post("/", postMessage);

module.exports = messageRouter;
