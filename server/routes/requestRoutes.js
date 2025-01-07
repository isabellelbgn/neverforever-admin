const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");

router.get("/requests", requestController.getRequests);
router.get("/requests/:id", requestController.getRequestById);
router.put("/requests/update/:id", requestController.updateRequest);
router.get("/requestlogs", requestController.getRequestLogs);

module.exports = router;