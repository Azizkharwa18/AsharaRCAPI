/**
 * @description Event
 * @route POST /event
 */

import { tryCatchWrapper } from "../middleware/trycatchWrapper.js";
import { pool } from "../db/connect.js"
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


//Get All Events
export const getAllEvents=tryCatchWrapper(async function(req,res,next){
    let sql = `select e.eventId,e.eventName,e.startDate,e.endDate,e.loc,e.eventInchargeITS, p.name as eventInchargeName, count(t.teamId) as totalTeams from event e left join person p on e.eventInchargeITS=p.its left join team t on e.eventId=t.onEvent group by e.eventId;`
    await pool.query(sql).then((result) => {
        return res.status(StatusCodes.OK).json({
            message: "Events Fetched Successfully",
            data: result
        })
    })
})





