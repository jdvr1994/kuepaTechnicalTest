import { Type } from "typescript";
import { IUser } from "../services/repositories/domain/user";

/**
 * DTO to create a new user (student or moderator)
 */
interface UserCreateDto {
    type: string;
    names: string;
    lastNames: string;
    userName: string;
    password: string;
    phone: string;
}

/**
 * DTO to update a user (student or moderator)
 */
interface UserUpdateDto {
    id: string;
    type: string;
    names: string;
    lastNames: string;
    phone: string;
}

/**
 * DTO to login a user (student or moderator)
 */
interface UserLoginDto {
    type: string;
    userName: string;
    password: string;
}

/**
 * DTO to response a user login request (student or moderator)
 */
interface UserLoginResponseDto {
    user: IUser;
    token: string;
}

export{ UserCreateDto, UserUpdateDto, UserLoginDto,UserLoginResponseDto}