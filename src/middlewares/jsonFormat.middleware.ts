import {Request, Response} from 'express'

/**
 * jsonFormatMiddleware is used to verify errors in the json object structure
 * @param err Express error
 * @param req Express Request object from API
 * @param res Express Response object to API
 * @param next callback to continue the API operation (Express)
 */
export function jsonFormatMiddleware( 
    err: SyntaxError,
    req: Request,
    res: Response,
    next:any
    ):void {
    if (err instanceof SyntaxError && "body" in err) {
        res.status(400).send({ code: 400, title: "formato JSON invalido", error: err.toString() });
    } else next();
} 