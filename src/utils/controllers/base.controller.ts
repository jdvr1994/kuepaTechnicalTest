import { Response } from "express";
import { ApplicationException } from "../exceptions/application.exception";
import { DateBaseException } from "../exceptions/db.exception";

/**
 * This is the base class use to build a controller
 * It is in charge of manage the exceptions
 */
export abstract class BaseController {
    handleException(err: any, res: Response){
        if(err instanceof ApplicationException){
            res.status(400);
            res.send(err.message);
        }else if(err instanceof DateBaseException){
            res.status(err.code);
            res.send(err.message);
        }else{
            console.log("Unexpected Error",{Errormessage: err})
            throw new Error();
        }
    }
}