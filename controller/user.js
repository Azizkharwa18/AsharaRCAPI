/**
 * @description Create User
 * @route POST /person
 */

import {tryCatchWrapper} from "./../middleware/tryCatchWrapper.js";
import {createCustomError} from "./../errors/customError.js";
import {pool} from "./../db/connect.js"
import { unauthenticatedError } from "../middleware/unauthenticated.js";
import { StatusCodes } from "http-status-codes"; 

export const createUser = tryCatchWrapper(async function (req, res, next) {
  console.log("Req:",req.body)
  const { its,name,age,whatsapp,contact_no,zone } = req.body;
  if (!its || !name|| !age || !whatsapp|| !contact_no || !zone){
    return next(unauthenticatedError("All fields are required"));
  }

  let sql = "INSERT INTO person (its,name,age,whatsapp,contact_no,zone) VALUES (?, ?, ?, ?, ?, ?)";
  await pool.query(sql, [its,name,age,whatsapp,contact_no,zone]);

  return res.status(StatusCodes.CREATED).json({ message: "User has been Created" });
});

export const updateUser = tryCatchWrapper(async function (req, res, next) {
  console.log("Req:",req.body)
  const { its,name,age,whatsapp,contact_no,zone } = req.body;
  if (!its || !name|| !age || !whatsapp|| !contact_no || !zone){
    next(createCustomError("All fields are required", 400));
    return unauthenticatedError("All fields are required");
  }

  let sql = "INSERT INTO person (its,name,age,whatsapp,contact_no,zone) VALUES (?, ?, ?, ?, ?, ?)";
  await pool.query(sql, [its,name,age,whatsapp,contact_no,zone]);

  return res.status(201).json({ message: "User has been Created" });
});

export const deleteUser = tryCatchWrapper(async function (req, res, next) {
  console.log("Req:",req.body)
  const { its,name,age,whatsapp,contact_no,zone } = req.body;
  if (!its || !name|| !age || !whatsapp|| !contact_no || !zone){
    next(createCustomError("All fields are required", 400));
    return res.status(400).json({ message: "All fields are required" });
  }

  let sql = "INSERT INTO person (its,name,age,whatsapp,contact_no,zone) VALUES (?, ?, ?, ?, ?, ?)";
  await pool.query(sql, [its,name,age,whatsapp,contact_no,zone]);

  return res.status(201).json({ message: "User has been Created" });
});

export const getUser = tryCatchWrapper(async function (req, res, next) {
  console.log("Req:",req.body)
  const { its } = req.body;
  if (!its){
    next(createCustomError("All fields are required", 400));
    return res.status(400).json({ message: "All fields are required" });
  }

  let sql = "SELECT its,name,age, from person where its = ? ";
  const data=await pool.query(sql, [its]);

  return res.status(StatusCodes.OK).json({ data: data[0] });
});

export const getAllUserWithFilter = tryCatchWrapper(async function (req, res, next) {
  console.log("Req:",req.body)
  const { its,name,age,whatsapp,contact_no,zone } = req.body;
  if (!its || !name|| !age || !whatsapp|| !contact_no || !zone){
    next(createCustomError("All fields are required", 400));
    return res.status(400).json({ message: "All fields are required" });
  }

  let sql = "INSERT INTO person (its,name,age,whatsapp,contact_no,zone) VALUES (?, ?, ?, ?, ?, ?)";
  await pool.query(sql, [its,name,age,whatsapp,contact_no,zone]);

  return res.status(201).json({ message: "User has been Created" });
});