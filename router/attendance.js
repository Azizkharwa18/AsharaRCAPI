import express from "express";
import {
    createAttendance,
    getAttendance,
    markAttendance,
    getAttendanceId,
    getAttendanceHistory
} from "../controller/attendance.js";

const router = express.Router();

router.route("/getAttendanceId").get(getAttendanceId);
router.route("/getAttendanceHistory/:id").get(getAttendanceHistory)
router.route("/:id").get(getAttendance)
router.route("/").post(createAttendance).patch(markAttendance)


export default router;