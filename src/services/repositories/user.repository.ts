import { IUser } from "./domain/user";

/**
 * This is the contract that all the UserRepositories have to implement
 */
export interface UserRepository{

    all(type: string):Promise<IUser[]>;
    find(id: string, type: string):Promise<IUser | null>;
    login(userName:string, password:string, type: string):Promise<IUser | null>;
    findByUser(userName: string):Promise<IUser | null>;
    store(user: IUser):Promise<IUser>;
    update(user: IUser):Promise<IUser>;
    delete(id: string):Promise<void>;
}