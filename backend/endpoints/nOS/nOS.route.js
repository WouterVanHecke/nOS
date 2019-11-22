import { Router } from "express";

import nOSController from "./nOS.controller";

const router = Router();
router.route("/getAccessToken").post(nOSController.getAccessToken);
router.route("/getCoins").post(nOSController.getCoins);
router.route("/setCoins").post(nOSController.setCoins);
router.route("/getTickets").post(nOSController.getTickets);
router.route("/setTickets").post(nOSController.setTickets);
router.route("/setTutorial").post(nOSController.setTutorial);
router.route("/getTutorial").post(nOSController.getTutorial);
router.route("/saveLevel").post(nOSController.saveLevel);
router.route("/loadLevel").post(nOSController.loadLevel);
router.route("/clearProgress").post(nOSController.clearProgress);
router.route("/hasProgress").post(nOSController.hasProgress);
router.route("/setDailyTimer").post(nOSController.setDailyTimer);
router.route("/getDailyTimer").post(nOSController.getDailyTimer);
router.route("/setFirstBonus").post(nOSController.setFirstBonus);
router.route("/getFirstBonus").post(nOSController.getFirstBonus);
router.route("/setMouse").post(nOSController.setMouse);
router.route("/getMouse").post(nOSController.getMouse);
router.route("/setEasy").post(nOSController.setEasy);
router.route("/setNormal").post(nOSController.setNormal);
router.route("/setExpert").post(nOSController.setExpert);
router.route("/getEasy").post(nOSController.getEasy);
router.route("/getNormal").post(nOSController.getNormal);
router.route("/getExpert").post(nOSController.getExpert);
router.route("/getEasyGlobal").post(nOSController.getEasyGlobal);
router.route("/getNormalGlobal").post(nOSController.getNormalGlobal);
router.route("/getExpertGlobal").post(nOSController.getExpertGlobal);

export default router;
