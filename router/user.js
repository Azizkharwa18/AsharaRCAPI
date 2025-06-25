import express from "express";
import {
  createUser,
  getUser,
  getAllUser,
  creatBulkUser
} from "../controller/user.js";

const router = express.Router();

router.route("/createBulkUser").post(creatBulkUser);
router.route("/getAllUsers").get(getAllUser);
router.route("/").post(createUser).get(getUser);

export default router;