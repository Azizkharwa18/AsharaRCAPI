import express from 'express';
import { loginUser, registerUser } from './../controller/login.js';

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/getLoginById").post(loginUser);

export default router;
