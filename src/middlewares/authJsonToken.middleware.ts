import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import { SECRET_TOKEN_KEY } from "../config";

/**
 * Structure of authorization response
 * code: response code for the request
 * isAuth: represent the authorization state
 * reason: Contains the details for the auth state
 */
interface AuthResponse{
    code: number;
    isAuth: boolean;
    reason: string;
}

/**
 * This function works as middleware for authorization process based on JsonToken.
 * This function verifies the type of stored entity in the JsonToken in order to verify if it is authorized for this route.
 * @param types Types of entities authorized for a route.
 * @returns 
 */
function isAuth(types: string[]) {
    return async function( req: Request, res: Response, next:any ):Promise<void>
        {
            const token = req.headers.authorization
            if(token) {
                // check the authorization level for the token (Beare format) 
                const result:AuthResponse = await checkTokenMultyTypeAccess(token.split(' ')[1],types)
                if (!result.isAuth) {
                    res.status(result.code).send({ code: 403, title: result.reason}); //The token is invalid, expired or its level is not sufficient
                }else next(); // Route allowed
            }else{
                res.status(401).send({ code: 401, title: "Don´t have authorization!"}); //Don't have token
            }
        }
}

/**
 * This function verifies the type of stored entity in the JsonToken is equal to some authorized types into @types
 * @param token is the token received from http request
 * @param types Types of entities authorized for a route.
 * @returns 
 */
async function checkTokenMultyTypeAccess(token:string ,types: string[]): Promise<AuthResponse>{
    try {
        const decoded: any= await jwt.verify(token, SECRET_TOKEN_KEY); //Verify the token validity
        // Verify the level of authorization (with its type)
        if(types.indexOf(decoded.type)<0){
            return {isAuth: false, reason: 'Don´t have authorization for this service!' , code: 403} as AuthResponse
        }else{
            return {isAuth: true, reason: 'Token is valid', code: 200} as AuthResponse
        }
    } catch (err:any) {
        if(err.expiredAt) return {isAuth: false, reason: 'Token has expired!' , code: 401} as AuthResponse
        return {isAuth: false, reason: 'Token is invalid. Don´t have authorization!', code: 401} as AuthResponse
    }
}

export{isAuth}