import { Request, Response } from "express";
import { UserCreateDto, UserLoginDto, UserUpdateDto } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { BaseController } from "../utils/controllers/base.controller";
import { STUDENT_AUTHORIZATION} from "../config";

class StudentController extends BaseController{
    
    private readonly userService: UserService

    /**
     * Constructor StudentController
     * @param userService is used to abstract the manage operations with the user repositorios
     */
    constructor(userService: UserService){
        super();
        this.userService = userService;
        this.getAllStudents = this.getAllStudents.bind(this)
        this.getStudent = this.getStudent.bind(this)
        this.createStudent = this.createStudent.bind(this)
        this.login = this.login.bind(this)
        this.getLogginHistory = this.getLogginHistory.bind(this)
        this.updateStudent = this.updateStudent.bind(this)
        this.deleteStudent = this.deleteStudent.bind(this)
    }

    /**
     * getAllStudents allows to get all the students without filters
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async getAllStudents(req: Request, res: Response){
        try{
            res.send(await this.userService.all(STUDENT_AUTHORIZATION))
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * getStudent allows to get a student by Id
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async getStudent(req: Request, res: Response){
        const studentId = req.params.id
        
        try{
            res.send(await this.userService.find(studentId,STUDENT_AUTHORIZATION))
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * login allows to login a student
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async login(req: Request, res: Response) {
        try{
            const userLogged = await this.userService.login({
                type: STUDENT_AUTHORIZATION,
                userName: req.body.userName,
                password: req.body.password
            } as UserLoginDto);

            res.send(userLogged)

        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * createStudent allows to create a new student
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async createStudent(req: Request, res: Response){
        
        try{
            const userCreated = await this.userService.store({
                type: STUDENT_AUTHORIZATION,
                userName: req.body.userName,
                password: req.body.password,
                names: req.body.names,
                lastNames: req.body.lastNames,
                phone: req.body.phone
            } as UserCreateDto);

            res.send(userCreated);
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * getLogginHistory allows to get a list of all loginDates for this student
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async getLogginHistory(req: Request, res: Response){
        const studentId = req.params.id
        
        try{
            res.send((await this.userService.find(studentId,STUDENT_AUTHORIZATION)).login_at)
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * updateStudent allows to update a student
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async updateStudent(req: Request, res: Response){
        const id = req.params.id

        try{
            const userUpdated = await this.userService.update({
                type: STUDENT_AUTHORIZATION,
                id: id,
                names: req.body.names,
                lastNames: req.body.lastNames,
                phone: req.body.phone
            } as UserUpdateDto);
            
            res.send(userUpdated);
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * deleteStudent allows to delete a student
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async deleteStudent(req: Request, res: Response){
        const id = req.params.id

        try{
            const userUpdated = await this.userService.delete(id);
            res.send(userUpdated);
        }catch(err){
            this.handleException(err,res)
        }
    }

}

export {StudentController}