import { ApplicationException } from "../utils/exceptions/application.exception";
import { IUser } from "./repositories/domain/user";
import { UserRepository } from "./repositories/user.repository";
import { UserCreateDto, UserLoginDto, UserLoginResponseDto, UserUpdateDto} from "../dtos/user.dto";
import { comparePassword, hashPassword } from "../utils/encryption/hashing";
import jwt from 'jsonwebtoken'
import { SECRET_TOKEN_KEY, TOKEN_EXP_TIME } from "../config";
import { ClassRepository } from "./repositories/class.repository";
import { IExtendedClass } from "./repositories/domain/class";

export class UserService {

    private readonly userRepository: UserRepository
    private readonly classRepository: ClassRepository

    constructor(userRepository: UserRepository, classRepository: ClassRepository){
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.all = this.all.bind(this);
        this.find = this.find.bind(this);
        this.store = this.store.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getMyStudents = this.getMyStudents.bind(this);
        this.getMyStudentsPerClass = this.getMyStudentsPerClass.bind(this);
    }

    public async all(type: string):Promise<IUser[]>{
        return await this.userRepository.all(type);
    }

    public async find(id: string, type: string):Promise<IUser>{
        const user = await this.userRepository.find(id, type);
        if(user) return user;
        else throw new ApplicationException('User user does not exists.')
    }

    public async login(user: UserLoginDto): Promise<UserLoginResponseDto>{
        const userFound = await this.userRepository.login(user.userName, user.password, user.type);
        if(userFound){
            const isValidPassword = await comparePassword(user.password, userFound.password);
            userFound.password = ""
            const userToken = jwt.sign({id: userFound.id, email: userFound.userName, type: userFound.type}, SECRET_TOKEN_KEY, {expiresIn: TOKEN_EXP_TIME});
            if(isValidPassword) return {user: userFound, token: userToken} as UserLoginResponseDto;
            else throw new ApplicationException(`Invalid ${user.type} credentials.`)
        } else throw new ApplicationException(`Invalid ${user.type} credentials.`)
    }

    public async getMyStudents(id: string): Promise<IUser[]>{
        const myClasses: IExtendedClass[] = await this.classRepository.findByModerator(id);

        if(myClasses.length == 0) throw new ApplicationException('You don´t have classes or students assigned.');
        else{
            const myStudentArrays = myClasses.map((myClass: IExtendedClass)=>{return myClass.students as IUser[];})
            const reducer = (previousStudents: IUser[], currentStudents: IUser[]) => previousStudents.concat(currentStudents);
            let myStudents = myStudentArrays.reduce(reducer);

            // Get the no-repeted students into the array (it only works with students = id)
            //myStudents = myStudents.filter((myStudent,index)=>{return myStudents.indexOf(myStudent) === index;})

            // Get the no-repeted students into the array (check with userName)
            myStudents = myStudents.filter((student, index, self) =>
                index === self.findIndex((studentFound) => ( studentFound.userName === student.userName))
            )

            return myStudents as IUser[];
        }

    }

    public async getMyStudentsPerClass(id: string){
        return await this.classRepository.findByModerator(id);
    }

    public async store(user: UserCreateDto):Promise<IUser>{
        const userFound = await this.userRepository.findByUser(user.userName);
        if(!userFound){
            user.password = await hashPassword(user.password)
            return await this.userRepository.store(user as IUser)
        }else{
            throw new ApplicationException('User user already exists.')
        }

    }

    public async update(user: UserUpdateDto):Promise<IUser>{
        const userFound = await this.userRepository.find(user.id, user.type);
        if(userFound){
            userFound.names = user.names? user.names : userFound.names;
            userFound.lastNames = user.lastNames? user.lastNames : userFound.lastNames;
            userFound.phone = user.phone? user.phone : userFound.phone;
            return await this.userRepository.update(userFound as IUser)
        }else{
            throw new ApplicationException('User not found.')
        }
    }

    public async delete(id: string):Promise<void>{
        await this.userRepository.delete(id);
    }
}