/**
 * @description Create User
 * @route POST /person
 */

import { tryCatchWrapper } from "../middleware/trycatchWrapper.js";
import { createCustomError } from "../errors/customError.js";
import { pool } from "../db/connect.js"
import { createBadRequest } from "../middleware/bad-request.js";
import { unauthenticatedError } from "../middleware/unauthenticated.js";
import { StatusCodes } from "http-status-codes";
import xlsx from "xlsx";


//Create a New User
export const createUser = tryCatchWrapper(async function (req, res, next) {
  console.log("createUser() Req:", req.body)
  const { its, name, age, whatsapp, contact_no, zone } = req.body;
  if (!its || !name || !age || !whatsapp || !contact_no || !zone) {
    return next(createBadRequest("All fields are required"));
  }

  let sql = "INSERT INTO person (its,name,age,whatsapp,contact_no,zone) VALUES (?, ?, ?, ?, ?, ?)";
  await pool.query(sql, [its, name, age, whatsapp, contact_no, zone]);

  return res.status(StatusCodes.CREATED).json({ message: "User has been Created" });
});

//Create New Users In Bulk
export const creatBulkUser = tryCatchWrapper(async function (req, res, next) {
  console.log("creatBulkUser() Req:", req.body)

  const file = xlsx.readFile('assets/combined_members_list.xlsx')
  // // const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]])
  var string = "";
  console.log("temp:", temp.length);
  /*const { list } = req.body;
  if (!list) {
    return next(createBadRequest("All fields are required"));
  }

  let sql = "INSERT INTO person (its,name,age,whatsapp,contact_no,zone) VALUES ?";
  await pool.query(sql, [list]);
*/

  let sql = `INSERT INTO person (its,name,whatsapp,contact_no,zone) VALUES ${string}`;
  console.log("SQL:", sql);
  await pool.query(sql);
  return res.status(StatusCodes.CREATED).json({ message: "Users has been Created" });
});

//update User Details : Under Work
export const updateUser = tryCatchWrapper(async function (req, res, next) {
  console.log("Req:", req.body)
  const { its, name, age, whatsapp, contact_no, zone } = req.body;
  if (!its || !name || !age || !whatsapp || !contact_no || !zone) {
    next(createCustomError("All fields are required", 400));
    return unauthenticatedError("All fields are required");
  }

  let sql = "INSERT INTO person (its,name,age,whatsapp,contact_no,zone) VALUES (?, ?, ?, ?, ?, ?)";
  await pool.query(sql, [its, name, age, whatsapp, contact_no, zone]);

  return res.status(201).json({ message: "User has been Updated" });
});


//Delete any User
export const deleteUser = tryCatchWrapper(async function (req, res, next) {
  console.log("deleteUser() Req:", req.body)
  const { its } = req.body;
  if (!its) {
    next(createCustomError("All fields are required", 400));
    return res.status(400).json({ message: "ITS Required" });
  }

  let sql = "delete from person where its = ? ";
  await pool.query(sql, [its]);

  return res.status(200).json({ message: "User has been Deleted" });
});



//Activate Or Deactivate Current User
export const changeUserState = tryCatchWrapper(async function (req, res, next) {
  console.log("deactivateUser() Req:", req.body)
  const { its, state } = req.body;
  if (!its || !state) {
    next(createCustomError("All fields are required", 400));
    return res.status(400).json({ message: "ITS Required" });
  }

  let sql;

  if (state == "activate")
    sql = "update person set isActive = 1 where its = ? ";
  else if (state == "deactivate")
    sql = "update person set isActive = 0 where its = ? ";

  await pool.query(sql, [its]);

  return res.status(200).json({ message: `User has been ${port}d` });
});


//get user details by ITS.
export const getUser = tryCatchWrapper(async function (req, res, next) {
  console.log("Req:", req.body)
  const { its } = req.body;
  if (!its) {
    next(createCustomError("All fields are required", 400));
    return res.status(400).json({ message: "All fields are required" });
  }

  let sql = "select p.its,p.name,p.age,p.whatsapp,p.contact_no,p.zone,r.roleName from person as p inner join rolemaster as r on p.role_id = r.roleId where p.isActive = 1 and p.its=? ";
  const data = await pool.query(sql, [its]);

  return res.status(StatusCodes.OK).json({ data: data[0] });
});


//Get All User with Designation
export const getAllUser = tryCatchWrapper(async function (req, res, next) {
  console.log("getAllUser() Req:")

  let sql = "select p.its,p.name,p.age,p.whatsapp,p.contact_no,p.zone,r.roleName from person as p inner join rolemaster as r on p.role_id = r.roleId where p.isActive = 1 order by zone,role_id";
  const data = await pool.query(sql);

  return res.status(StatusCodes.OK).json({ "data": data[0], "count": data[0].length });
});