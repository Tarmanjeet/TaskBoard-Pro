const express = require("express");
const automationRouter = express.Router();
const { triggerAutomation } = require("../controllers/automationController");

router.post("/trigger", protect, triggerAutomation);

module.exports = automationRouter;
