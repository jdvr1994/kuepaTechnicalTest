/**
 * File to manage the global variables, cofig variables
 * This file consumes the enviroment variables after dotenv has configured them
 */
export const APP_FOO =              process.env.APP_FOO             || 'development'
export const SERVER_PORT =          process.env.PORT                || 3000
export const MONGODB_URL =          process.env.MONGODB_URL         || 'mongodb://localhost:27017/exampleDevelopment'
export const API_URL =              process.env.API_URL             || '/api/'
export const SECRET_TOKEN_KEY =     process.env.SECRET_TOKEN_KEY    || 'tokenKey'


export const ADMIN_AUTHORIZATION        =  'administrator'
export const MODERATOR_AUTHORIZATION     =  'moderator'
export const STUDENT_AUTHORIZATION         =  'student'
export const TOKEN_EXP_TIME             =  '1h'