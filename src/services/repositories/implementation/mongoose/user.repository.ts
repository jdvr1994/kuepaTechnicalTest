import UserModel from "../../../../models/user.model";
import { IUser } from "../../domain/user";
import { UserRepository } from "../../user.repository";
import { isValidObjectId } from "mongoose";
import { DateBaseException } from "../../../../utils/exceptions/db.exception";

/**
 * UserMongooseRepository is the repository to manage of direct way the communication with the MongoDB database (mongoose)
 * UserRepository is the contract signed by all the Repositories (for User)
 */
export class UserMongooseRepository implements UserRepository{

    /**
     * all - used to get all users with a specifically type from database
     * @param type can be moderator or student
     */
    public async all(type: string):Promise<IUser[]>{
        const users = await UserModel.find({type: type});
        return users as IUser[]
    }

    /**
     * find - used to get a user by Id and type from database
     * @param id userId
     * @param type type of the user (moderator or student)
     */
    public async find(id: string, type: string):Promise<IUser | null>{
        if(!isValidObjectId(id)) throw new DateBaseException(`The objectId for ${type} format is wrong!`)
        const user = await UserModel.findOne({_id : id, type: type}).lean()
        return user as IUser
    }

    /**
     * login is used to login a user
     * @param userName - credentials
     * @param password - credentials
     * @param type - type of the user (moderator or student)
     */
    public async login(userName:string, password:string, type: string):Promise<IUser> {
        const user = await UserModel.findOneAndUpdate({userName : userName, type: type},{ $push: { login_at: new Date() } },{new: true}).select('+password').lean()
        if(user) user.id = user._id;
        return user as IUser;
    }

    /**
     * findByUser allows to find a user by its userName
     * @param userName 
     */
    public async findByUser(userName: string): Promise<IUser | null> {
        const user = await UserModel.findOne({userName : userName}).lean()
        return user as IUser
    }

    /**
     * store is used to create a new user
     * @param user contains the data to store in the database
     */
    public async store(user: IUser):Promise<IUser>{
        user.created_at = new Date();
        const newUser = new UserModel(user)

        try{
            const userStored = await newUser.save()
            const userStoredLean = userStored.toObject()
            return userStoredLean as IUser
        }catch(err){
            throw new DateBaseException('User',err);
        }
    }

    /**
     * update is used to update a user
     * @param user contains the data to push into the existing user
     */
    public async update(user: IUser):Promise<IUser>{
        user.updated_at = new Date();
        try{
            const userUpdated = await UserModel.findOneAndUpdate({userName: user.userName},user,{new: true}).lean()
            return userUpdated as IUser
        }catch(err){
            throw new DateBaseException('User',err);
        }
    }

    /**
     * delete allows to delete a user by id
     * @param id 
     */
    public async delete(id: string):Promise<void>{
        const user = await UserModel.findOneAndDelete({_id: id})
        console.log(user)
    }
}