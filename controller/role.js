/**
 * @description Role
 * @route POST /role
 */

import { tryCatchWrapper } from "../middleware/tryCatchWrapper.js";
import { pool } from "../db/connect.js"
import { createBadRequest } from "../middleware/bad-request.js";
import { StatusCodes } from "http-status-codes";


//Create a New Role
export const createRole = tryCatchWrapper(async function (req, res, next) {
    const { roleName, designatedTo } = req.body
    if (!roleName) {
        return next(createBadRequest("All fields are required"));
    }

    let sql = `insert into rolemaster (roleName,designatedTo) values (?, ?)`
    await pool.query(sql, [roleName, designatedTo]).then(() => {
        return res.status(StatusCodes.CREATED).json({
            message: "Role Created Successfully"
        })
    });

})


//Update Role Details
export const updateRole = tryCatchWrapper(async function (req, res, next) {

    const { roleId, roleName } = req.body

    if (!roleId) {
        return next(createBadRequest("All fields are required"));
    }

    let sql = `update person set roleName = ? where roleId = ?`


    await pool.query(sql, [roleName]).then(() => {
        return res.status(StatusCodes.OK).json({
            message: "Role Updated Successfully"
        })
    });

})


//Delete any Role
export const deleteRole = tryCatchWrapper(async function (req, res, next) {

    const { roleId } = req.body

    if (!roleId) {
        return next(createBadRequest("All fields are required"));
    }

    let sql = `delete from rolemaster where roleId = ?`

    await pool.query(sql, [roleId]).then(() => {
        return res.status(StatusCodes.OK).json({
            message: "Role Deleted Successfully"
        })
    })

})


//Activate or Deactivate Role
export const changeRoelStatus = tryCatchWrapper(async function (req, res, next) {

    const { roleId, status } = req.body

    if (!roleId) {
        return next(createBadRequest("All fields are required"));
    }

    let sql

    if (status == "activate")
        sql = `update rolemaster set isActive=1 where roleId=?`

    else if (status == "deactivate")
        sql = `update rolemaster set isActive=0 where roleId=?`

    await pool.query(sql, [roleId]).then(() => {
        return res.status(StatusCodes.OK).json({
            message: `Role ${status}d Successfully`
        })
    })

})

//Get all Roles
export const getAllRoles = tryCatchWrapper(async function (req, res, next) {
    let sql = `select roleId,roleName from rolemaster`

    const data = await pool.query(sql)

    return res.status(StatusCodes.OK).json({ data: data[0] });
})