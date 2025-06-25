import express from "express";
import {
  getAllTeamId,
  getAllTeamWithMembers,
  getATeamWithMembers,
  addBulkTeamMember
} from "../controller/team.js";

const router = express.Router();

router.route("/teamBulkUpload").post(addBulkTeamMember)
router.route("/getId").get(getAllTeamId);
router.route("/:id").get(getATeamWithMembers);
router.route("/").get(getAllTeamWithMembers);

export default router;