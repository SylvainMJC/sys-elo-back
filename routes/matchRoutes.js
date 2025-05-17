const express = require("express");

const MatchController = require("../controllers/matchController");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

module.exports = (matchController) => {
  const router = express.Router();

  router.post("/", matchController.createMatch.bind(matchController));
  router.get("/", matchController.getAllMatches.bind(matchController));
  router.get("/:id", matchController.getMatchById.bind(matchController));
  router.put("/:id", matchController.updateMatch.bind(matchController));
  router.patch("/:id", matchController.patchMatchStatus.bind(matchController));
  router.delete("/:id", matchController.deleteMatch.bind(matchController));

  //redis
  router.post("/:id/start", matchController.startMatch.bind(matchController));
  router.patch("/:id/score", matchController.updateLiveScore.bind(matchController));
  router.post("/:id/end", matchController.endMatch.bind(matchController));
  router.get("/:id/live", matchController.getLiveMatchData.bind(matchController));




  return router;
};
