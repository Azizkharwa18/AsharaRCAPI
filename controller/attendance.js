/**
 * @description Attendance
 * @route POST /attendance
 */

import { tryCatchWrapper } from "../middleware/trycatchWrapper.js";
import { pool } from "../db/connect.js"
import { createBadRequest } from "../middleware/bad-request.js";
import { StatusCodes } from "http-status-codes";
import xlsx from 'xlsx';


export const createAttendance=tryCatchWrapper(async function(req,res,next){
                let string = "";
             const file = xlsx.readFile('assets/combined_members_list.xlsx')
             const temp = xlsx.utils.sheet_to_json(file.Sheets["Sheet1"])
             console.log(temp.length)
             for (let i = 0; i < temp.length; i++) {
                 if (temp.length - 1 == i)
                     string += `(400, ${temp[i].its})`
                 else
                     string += `(400, ${temp[i].its}),`
             }

             let sql=`insert into event_session (event_session_id,its) values ${string}`
             await pool.query(sql).then(() => { 
             return res.status(StatusCodes.CREATED).json({
                 message: "Attendance Created Successfully",
                 data: string
             })
             })
})


export const getAttendance=tryCatchWrapper(async function(req,res,next){
    let sql=`select event_session_id,event_session.its,isPresent,person.name from event_session inner join person on person.its=event_session.its where event_session_id=400 order by (person.name)`

    await pool.query(sql).then((result)=>{
        return res.status(StatusCodes.OK).json({
            data: result[0],
            total_present: result[0].filter((item) => item.isPresent === 1).length,
        })              
    }).catch((err)=>{
        return next(createBadRequest("Error fetching attendance"))
    })
})

export const markAttendance=tryCatchWrapper(async function(req,res,next){

    const {its}=req.body;

    let sql=`update event_session set isPresent=1 where event_session_id=400 and its=${its}`

    await pool.query(sql).then((result)=>{
        return res.status(StatusCodes.OK).json({
            message: "Attendance Marked Successfully",
        })              
    }).catch((err)=>{
        return next(createBadRequest("Error Marking attendance"))
    })
})