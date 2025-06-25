import { CustomError } from '../errors/customError.js'
import { StatusCodes } from 'http-status-codes'

class UnauthenticatedError extends CustomError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

export const unauthenticatedError = (message) => {
    return new UnauthenticatedError(message)
}