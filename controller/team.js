/**
 * @description Team
 * @route POST /team
 */

import { tryCatchWrapper } from "./../middleware/tryCatchWrapper.js";
import { pool } from "./../db/connect.js"
import { createBadRequest } from "../middleware/bad-request.js";
import { StatusCodes } from "http-status-codes";
import xlsx from "xlsx";

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


//Bulk Team Add Member
export const addBulkTeamMember = tryCatchWrapper(
    async function (req, res, next) {
        let string = "";
        const file = xlsx.readFile('assets/bgi_allotment_charts.xlsx')
        const temp = xlsx.utils.sheet_to_json(file.Sheets["Zonal-Najmi"])
        console.log(temp.length)
        for (let i = 0; i < temp.length; i++) {
            if (temp.length - 1 == i)
                string += `(110, ${temp[i].its}, 60433342)`
            else
                string += `(110, ${temp[i].its}, 60433342),`
        }

        let sql = `insert into team_assignment (team_id, its, addedBy) values ${string}`
        await pool.query(sql).then(() => {
            return res.status(StatusCodes.CREATED).json({
                message: "Bulk Team Member Added Successfully",
            })
        })
    }
)

//Get All Teams
export const getAllTeamId = tryCatchWrapper(async function (req, res, next) {
    console.log("getAllTeamId called");
    let sql = `select t.teamId,t.teamName from team as t inner join event on t.onEvent=event.eventId where event.eventId = 201`

    const data = await pool.query(sql)

    return res.status(StatusCodes.OK).json({
        data: data[0]
    })

})

//Get a Team with Members
export const getATeamWithMembers = tryCatchWrapper(async function (req, res, next) {
    const { id } = req.params;
    console.log("getATeamWithMembers called", id);
    var teamList = [];
    let sql = `select t.teamName,t.teamLeadITS,p.its,p.name,p.contact_no,p.zone from team as t inner join team_assignment as tn on tn.team_id=t.teamId inner join person as p on tn.its = p.its where t.teamId= ${id} order by p.name`
    await pool.query(sql).then(async (data) => {
        let sql1 = `select person.name,person.its,person.contact_no from person where person.its = ${data[0][0].teamLeadITS}`
        await pool.query(sql1).then((teamLead) => {
            teamList.push({
                teamName: data[0][0].teamName,
                teamLead: teamLead[0][0].name,
                teamLeadITS: teamLead[0][0].its,
                teamLeadContact: teamLead[0][0].contact_no,
                memberCount: data[0].length,
                members: data[0]
            })
        })
    })
    return res.status(StatusCodes.OK).json({
        teamList: teamList
    })

})

//Get all Team with Members
export const getAllTeamWithMembers = tryCatchWrapper(async function (req, res, next) {

    let sql = ` select t.teamId from team as t inner join event on t.onEvent=event.eventId where event.eventId=200 `

    let tempList = await pool.query(sql)

    var teamList = [];
    for (let i = 0; i < tempList[0].length; i++) {
        let sql = `select t.teamName,t.teamLeadITS,p.its,p.name,p.contact_no,p.zone from team as t inner join team_assignment as tn on tn.team_id=t.teamId inner join person as p on tn.its = p.its where t.teamId= ${tempList[0][i].teamId}`
        await pool.query(sql).then(async (data) => {
            let sql1 = `select person.name,person.its,person.contact_no from person where person.its = ${data[0][0].teamLeadITS}`
            await pool.query(sql1).then((teamLead) => {
                teamList.push({
                    teamName: data[0][0].teamName,
                    teamLead: teamLead[0][0].name,
                    teamLeadITS: teamLead[0][0].its,
                    teamLeadContact: teamLead[0][0].contact_no,
                    memberCount: data[0].length,
                    members: data[0]
                })
            })
        })
        console.log(teamList)
        if (tempList[0].length - 1 == i) {
            return res.status(StatusCodes.OK).json({
                teamList: teamList
            })
        }
    }

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
        sql = `update team set isActive=1 where teamId = ?`

    else if (status == "deactivate")
        sql = `update team set isActive=0 where teamId = ?`

    await pool.query(sql, [teamId]).then(() => {
        return res.status(StatusCodes.OK).json({
            message: `Team ${status}d Successfully`
        })
    })

})