import bcrypt from "bcryptjs"
import { ApplicationException } from "../exceptions/application.exception";

/**
 * hashPassword allows to hash a password using bcrypt method
 * @param password - It is the password that you want to encrypte (to hash)
 */
async function hashPassword(password:string):Promise<string>{
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        throw new ApplicationException('An error ocurred during hashing process')
    }
} 

/**
 * comparePassword allows to compare a hashed password with the original password in order to verify its validity
 * @param password is original password
 * @param hashedPassword is the hashed password (bcrypt)
 */
async function comparePassword(password:string, hashedPassword:string):Promise<boolean>{
    try {
        const result = await bcrypt.compare(password,hashedPassword);
        return result;
    } catch (err) {
        throw new ApplicationException(`An error ocurred during compare password process: ${err}`)
    }
} 

export {hashPassword, comparePassword}