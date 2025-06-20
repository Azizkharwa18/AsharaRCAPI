/**
 * @description Team
 * @route POST /team
 */

import { tryCatchWrapper } from "./../middleware/tryCatchWrapper.js";
import { pool } from "./../db/connect.js"
import { createBadRequest } from "../middleware/bad-request.js";
import { StatusCodes } from "http-status-codes";


export const createTeam = tryCatchWrapper(
    async function (req, res, next) {
        const { teamName, onEvent, teamLead } = req.body;
        if (!teamName || !onEvent || !teamLead) {
            return next(createBadRequest("All fields are required"));
        }

        let sql = `insert into team (teamName,onEvent,teamLeadITS) values (?, ?, ?)`

        await pool.query(sql, [teamName, onEvent, teamLead]).then(() => {
            return res.status(StatusCodes.CREATED).json({
                message: "Team Created Successfully"
            })
        })
    }
)

export const addTeamMember = tryCatchWrapper(
    async function (req, res, next) {
        const { team_id, its, addedBy } = req.body;
        if (!team_id || !its || !addedBy) {
            return next(createBadRequest("All fields are required"));
        }

        let sql = `insert into team_assignment ( team_id,its,addedBy ) values (?, ?, ?)`

        await pool.query(sql, [team_id, its, addedBy]).then(() => {
            return res.status(StatusCodes.CREATED).json({
                message: "Member Assigned Successfully"
            })
        })
    }
)

export const addBulkTeamMember = tryCatchWrapper(
    async function (req, res, next) {
        const { list, addedBy } = req.body;
        if (!team_id || !its || !addedBy) {
            return next(createBadRequest("All fields are required"));
        }

        for (let i = 0; i < list.length; i++) {
            let sql = `insert into team_assignment ( team_id,its,addedBy ) values (?, ?, ?)`
            await pool.query(sql, [team_id, its, addedBy])
        }

        return res.status(StatusCodes.CREATED).json({
            message: "Members Assigned Successfully"
        })
    }
)


//Get All Teams
export const getAllTeam = tryCatchWerapper(async function (req, res, next) {

    let sql = `select t.teamId,t.onEvent,t.teamName,t.teamLeadITS,e.eventName,p.name,r.roleName from team as t inner join event as e on t.onEvent = e.eventId inner join person as p on t.teamLeadITS = p.its right join rolemaster as r on p.role_id = r.roleId`

    const data = await pool.query(sql)

    return res.status(StatusCodes.OK).json({
        data: data[0]
    })

})


//Get a Team with Members
export const getAllTeamWithMembers = tryCatchWerapper(async function (req, res, next) {
    let sql = `select teamId,onEvent,teamName,teamLeadITS from team_assignment as t innerjoin `

    const data = await pool.query(sql)

    return res.status(StatusCodes.OK).json({
        data: data[0]
    })

})

//delete a Team
export const deleteTeam = tryCatchWrapper(async function (req, res, next) {
    const { teamId } = req.body;

    if (!teamId) {
        return next(createBadRequest("All fields are required"));
    }

    let sql = `delete from team where teamId = ?`

    await pool.query(sql, [teamId]).then1(() => {
        return res.status(StatusCodes.OK).json({
            message: "Team Deleted Successfully"
        })
    })
})



//Activate or Deactivate Team
export const changeTeamStatus = tryCatchWrapper(async function (req, res, next) {

    const { teamId, status } = req.body

    if (!roleId) {
        return next(createBadRequest("All fields are required"));
    }

    let sql

    if (status == "activate")
        sql = `update team set isActive=1 where teamId=?`

    else if (status == "deactivate")
        sql = `update team set isActive=0 where teamId=?`

    await pool.query(sql, [roleId]).then(() => {
        return res.status(StatusCodes.OK).json({
            message: `Team ${status}d Successfully`
        })
    })

})