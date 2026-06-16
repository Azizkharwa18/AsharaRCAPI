import { tryCatchWrapper } from "../middleware/trycatchWrapper.js"
import { createBadRequest } from "../middleware/bad-request.js";
import { unauthenticatedError } from "../middleware/unauthenticated.js"
import { StatusCodes } from "http-status-codes";
import { createAdmin, findAdminUser } from "../model/login.js"
import jwt from "jsonwebtoken";
import config from "../utils/config.js";
import bcrypt from 'bcrypt';

//Register Admin
export const registerUser = tryCatchWrapper(async (req, res, next) => {
    const { its, password } = req.body;
    if (!its || !password) {
        return next(createBadRequest("Please provide its and password"));
    }

    const tempUser = await createAdmin(its, password)

    if (!tempUser) {
        return next(createBadRequest("Error while Registering Admin"));
    }

    const token = jwt.sign(
        { its: tempUser.its, zone: tempUser.zone, name: tempUser.name },
        config.jwt.secret,
        { expiresIn: '10d' }
    );
    if (its == 60433342) {
        res.status(StatusCodes.CREATED).json({ its: tempUser.its, zone: tempUser.zone, name: tempUser.name, token: token });
    }
    else {
        res.status(StatusCodes.CREATED).json({ its: tempUser.its, zone: tempUser.zone, name: tempUser.name, team: tempUser.teamId, token: token });
    }
});

//Login To Admin Panel
export const loginUser = tryCatchWrapper(async (req, res, next) => {
    const { its, password } = req.body;
    if (!its || !password) {
        return next(unauthenticatedError("Please provide all values"));
    }

    const result = await findAdminUser(its);

    if (!result) {
        return next(createBadRequest("Invalid Credentials"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, result.password);

    if (!isPasswordCorrect) {
        return next(unauthenticatedError("Password Incorrect"));
    }

    const token = jwt.sign(
        { its: result.its, zone: result.zone, name: result.name },
        config.jwt.secret,
        { expiresIn: '10d' }
    );
    if (its == 60433342) {
        res.status(StatusCodes.OK).json({ its: result.its, zone: result.zone, name: result.name, token: token });
    }
    else {
        res.status(StatusCodes.OK).json({ its: result.its, zone: result.zone, name: result.name, team: result.teamId, token: token });
    }
});