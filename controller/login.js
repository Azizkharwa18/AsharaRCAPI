import { tryCatchWrapper } from "./../middleware/tryCatchWrapper.js"
import { createBadRequest } from "./../middleware/bad-request.js";
import { unauthenticatedError } from "./../middleware/unauthenticated.js"
import { StatusCodes } from "http-status-codes";
import Login from '../model/login.js';

export const getLoginById = tryCatchWrapper(async (req, res, next) => {
    const { its, password } = req.body
    
    console.log("ID>>", req.body)
    
    if (!its|| !password)
        return next(createBadRequest("Please Provide ITS Password"))
    
    const result = await Login.findOne({ its })

    if (!result)
        return next(unauthenticatedError("Invalid Credentails"))

    const isPassCorrect = await result.comparePass(password)

    if (!isPassCorrect)
        return next(unauthenticatedError("Invalid Credentails"))

    const token = result.createJWT()
    res.status(StatusCodes.OK).json({ "team":result.team, token })
})

export const createlogin = tryCatchWrapper(async (req, res, next) => {
    console.log("Login : ",req.body)
    const created = await Login.create(req.body)
    if (!created) {
        return next(createCustomError("No Login ID Found", 404))
    }
    res.status(StatusCodes.CREATED).json({ "team":created.team, "token":created.createJWT() })
})