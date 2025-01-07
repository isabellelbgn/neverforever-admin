const express = require("express");
const router = express.Router();
const rewardController = require("../controllers/rewardController");

router.get("/rewards", rewardController.getRewards);
router.post("/rewards", rewardController.addReward);
router.delete("/rewards/:id", rewardController.deleteReward);
router.get("/rewards/:id", rewardController.getRewardById);
router.put("/rewards/update/:id", rewardController.updateReward);

module.exports = router;
