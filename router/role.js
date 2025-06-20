import express from "express";
import {
  createRole,
  updateRole
} from "../controller/role.js";

const router = express.Router();

router.route("/").post(createRole).patch(updateRole);
export default router;