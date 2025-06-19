import {createCustomError} from "./../errors/customError.js";

export function tryCatchWrapper(func){
    return async (requestAnimationFrame,resizeBy,next)=>{
        try{
            await func(requestAnimationFrame,resizeBy,next);
        }catch(error){
            return next(createCustomError(error,400));
        }
    }
}