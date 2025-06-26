/**
 * @description Attendance
 * @route POST /attendance
 */

import { tryCatchWrapper } from "../middleware/trycatchWrapper.js";
import { pool } from "../db/connect.js"
import { createBadRequest } from "../middleware/bad-request.js";
import { StatusCodes } from "http-status-codes";
import xlsx from 'xlsx';


export const createAttendance = tryCatchWrapper(async function (req, res, next) {

    let string = "";
    let temp = `select its from person`;
    const itsData = await pool.query(temp)

    for (let i = 0; i < itsData[0].length; i++) {
        if (itsData[0].length - 1 == i)
            string += `(401, ${itsData[0][i].its})`
        else
            string += `(401, ${itsData[0][i].its}),`
    }

    let sql = `insert into event_session (event_session_id,its) values ${string}`
    await pool.query(sql).then(() => {
        return res.status(StatusCodes.CREATED).json({
            message: "Attendance Created Successfully"
        })
    })
})


export const getAttendance = tryCatchWrapper(async function (req, res, next) {

    const { id } = req.params
    const its = id.split("&")[0]
    const teamId = id.split("&")[1]
    console.log(its,"::",teamId)
    let sql;
    if (its == 60433342) {
        sql = `select event_session_id,event_session.its,isPresent,person.name,session_master.session_name,event.eventName from event_session inner join person on person.its=event_session.its inner join session_master on session_master.session_id=event_session.event_session_id inner join event on event.eventId=session_master.event_id where session_start<now() and session_end>now() and session_master.isActive=1 order by (person.name)`
        await pool.query(sql).then((result) => {
            return res.status(StatusCodes.OK).json({
                data: result[0],
                total_present: result[0].filter((item) => item.isPresent === 1).length,
                session_name: result[0][0]?.session_name,
                event_name: result[0][0]?.eventName,
            })
        }).catch((err) => {
            return next(createBadRequest("Error fetching attendance"))
        })
    }
    else {
        sql = `select event_session_id,event_session.its,isPresent,person.name,session_master.session_name,event.eventName from event_session inner join person on person.its=event_session.its inner join session_master on session_master.session_id=event_session.event_session_id inner join event on event.eventId=session_master.event_id inner join team_assignment on person.its=team_assignment.its inner join team on team_assignment.team_id=team.teamId where team.teamId=? and session_start<now() and session_end>now() and session_master.isActive=1 order by (person.name)`
        await pool.query(sql, [teamId]).then((result) => {
            return res.status(StatusCodes.OK).json({
                data: result[0],
                total_present: result[0].filter((item) => item.isPresent === 1).length,
                session_name: result[0][0]?.session_name,
                event_name: result[0][0]?.eventName,
            })
        }).catch((err) => {
            return next(createBadRequest("Error fetching attendance"))
        })
    }



})

export const getAttendanceHistory = tryCatchWrapper(async function (req, res, next) {

    const { id } = req.params;

    let sql = `select event_session_id,event_session.its,isPresent,person.name,session_master.session_name,event.eventName from event_session inner join person on person.its=event_session.its inner join session_master on session_master.session_id=event_session.event_session_id inner join event on event.eventId=session_master.event_id where event_session_id= ? order by (person.name)`

    await pool.query(sql, [id]).then((result) => {
        return res.status(StatusCodes.OK).json({
            data: result[0],
            total_present: result[0].filter((item) => item.isPresent === 1).length,
            session_name: result[0][0]?.session_name,
            event_name: result[0][0]?.eventName,
        })
    }).catch((err) => {
        return next(createBadRequest("Error fetching attendance history"))
    })
})

export const getAttendanceId = tryCatchWrapper(async function (req, res, next) {
    let sql = `select session_id,session_name from session_master where event_id=201`

    await pool.query(sql).then((result) => {
        return res.status(StatusCodes.OK).json({
            data: result[0]
        })
    }).catch((err) => {
        return next(createBadRequest("Error fetching attendance Ids"))
    })
})

export const markAttendance = tryCatchWrapper(async function (req, res, next) {

    const { its } = req.body;

    let sql = `update event_session set isPresent=1 where event_session_id=400 and its=${its}`

    await pool.query(sql).then((result) => {
        return res.status(StatusCodes.OK).json({
            message: "Attendance Marked Successfully",
        })
    }).catch((err) => {
        return next(createBadRequest("Error Marking attendance"))
    })
})