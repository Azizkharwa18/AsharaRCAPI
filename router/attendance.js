import express from "express";
import {
    createAttendance,
    getAttendance,
    markAttendance
} from "../controller/attendance.js";

const router = express.Router();

router.route("/").post(createAttendance).get(getAttendance).patch(markAttendance);

export default router;