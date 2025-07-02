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

    const { eventId, sessionName, sessionStart, sessionEnd, createdBy } = req.body

    let sql1 = `insert into session_master (event_id,session_name,session_start,session_end,createdBy) values (?,?,?,?,?);`

    await pool.query(sql1, [eventId, sessionName, sessionStart, sessionEnd, createdBy])

    sql1 = `select session_id from session_master where session_name=?`

    const data = await pool.query(sql1, [sessionName])

    let string = "";
    let temp = `select its from person`;
    const itsData = await pool.query(temp)

    for (let i = 0; i < itsData[0].length; i++) {
        if (itsData[0].length - 1 == i)
            string += `(${data[0][0].session_id}, ${itsData[0][i].its})`
        else
            string += `(${data[0][0].session_id}, ${itsData[0][i].its}),`
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
    let sql;
    if (its == 60433342) {
        console.log("Inside 64")
        sql = `select event_session_id,event_session.its,isPresent,person.name,session_master.session_name,event.eventName from event_session inner join person on person.its=event_session.its inner join session_master on session_master.session_id=event_session.event_session_id inner join event on event.eventId=session_master.event_id where session_start<now() and session_end>now() and session_master.isActive=1 order by (person.name)`
        await pool.query(sql).then((result) => {
            return res.status(StatusCodes.OK).json({
                data: result[0],
                total_present: result[0].filter((item) => item.isPresent === 1).length,
                session_name: result[0][0]?.session_name,
                event_name: result[0][0]?.eventName,
                event_session_id: result[0][0]?.event_session_id
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
                event_session_id: result[0][0]?.event_session_id
            })
        }).catch((err) => {
            return next(createBadRequest("Error fetching attendance"))
        })
    }
})

export const getAttendanceHistory = tryCatchWrapper(async function (req, res, next) {

    const { id } = req.params;

    console.log("ID REQ:",id)

    if(!id)
        return next(createBadRequest("Error fetching Attendance Gistory"))

    let sqlData = []
    sqlData.push(id.split("&")[0])

    if (id.split("&").length > 1)
        sqlData.push(id.split("&")[1])

    let sql;

    if (sqlData.length == 1) {
        sql = `select event_session_id,event_session.its,isPresent,person.name,session_master.session_name,event.eventName from event_session inner join person on person.its=event_session.its inner join session_master on session_master.session_id=event_session.event_session_id inner join event on event.eventId=session_master.event_id where event_session_id= ? order by (isPresent) desc, (person.name)`

    }
    else {
        sql = `select t.teamName,t.teamLeadITS,p.its,p.name,p.contact_no,p.zone,event_session.event_session_id,event_session.isPresent from team as t inner join team_assignment as tn on tn.team_id=t.teamId inner join person as p on tn.its = p.its inner join event_session on event_session.its=p.its where event_session.event_session_id=? and  t.teamId= ? order by (isPresent) desc, (person.name)`
    }

    await pool.query(sql, sqlData).then((result) => {
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

    const { its, event_session } = req.body;

    let sql = `update event_session set isPresent=1 where event_session_id=? and its=?`

    await pool.query(sql, [event_session, its]).then((result) => {
        return res.status(StatusCodes.OK).json({
            message: "Attendance Marked Successfully",
        })
    }).catch((err) => {
        return next(createBadRequest("Error Marking attendance"))
    })
})