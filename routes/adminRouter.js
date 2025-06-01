const { Router } = require("express");
const { getAdmin, postAdmin } = require("../controllers/adminController");

const adminRouter = Router();

adminRouter.get("/", getAdmin);
adminRouter.post("/", postAdmin);

module.exports = adminRouter;
