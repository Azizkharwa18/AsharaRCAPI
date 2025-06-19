import { CustomError } from '../errors/customError.js'
import { StatusCodes } from 'http-status-codes'

class BadRequestError extends CustomError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

export const createBadRequest = (message) => {
    return new BadRequestError(message)
}