/**
 * @description Event
 * @route POST /event
 */

import { tryCatchWrapper } from "./../middleware/tryCatchWrapper.js";
import { pool } from "./../db/connect.js"
import { createBadRequest } from "../middleware/bad-request.js";
import { StatusCodes } from "http-status-codes";

export const createEvent = tryCatchWrapper(async function (req, res, next) {
    const { eventName, startDate, endDate, loc, eventInchargeITS } = req.body;

    if (!eventName || !startDate || !endDate || !loc || !eventInchargeITS) {
        return next(createBadRequest("All fields are required"));
    }

    let sql = `insert into event (eventName,startDate,endDate,loc,eventInchargeITS) values (?,?,?,?,?) )`
    await pool.query(sql, [eventName, startDate, endDate, loc, eventInchargeITS]).then(() => {
        return res.status(StatusCodes.CREATED).json({
            message: "Event Created Successfully"
        })
    })
})


