import express from 'express';
import { createlogin,getLoginById } from './../controller/login.js';

const router=express.Router();

router.route("/").post(createlogin);
router.route("/getLoginById").post(getLoginById);

export default router;
