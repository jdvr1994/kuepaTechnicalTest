import { Request, Response } from "express";
import { UserCreateDto, UserLoginDto, UserUpdateDto } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { BaseController } from "../utils/controllers/base.controller";
import { MODERATOR_AUTHORIZATION} from "../config";

class ModeratorController extends BaseController{
    
    private readonly userService: UserService

    /**
     * Constructor ModeratorController
     * @param userService is used to abstract the manage operations with the user repositorios
     */
    constructor(userService: UserService){
        super();
        this.userService = userService;
        this.getAllModerators = this.getAllModerators.bind(this)
        this.getModerator = this.getModerator.bind(this)
        this.createModerator = this.createModerator.bind(this)
        this.login = this.login.bind(this)
        this.getMyStudents = this.getMyStudents.bind(this)
        this.updateModerator = this.updateModerator.bind(this)
        this.deleteModerator = this.deleteModerator.bind(this)
    }

    /**
     * getAllModerators allows to get all the moderators without filters
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async getAllModerators(req: Request, res: Response){
        try{
            res.send(await this.userService.all(MODERATOR_AUTHORIZATION))
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * getModerator allows to get a moderator by Id
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async getModerator(req: Request, res: Response){
        const moderatorId = req.params.id
        
        try{
            res.send(await this.userService.find(moderatorId,MODERATOR_AUTHORIZATION))
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * getMyStudents allows to get a list of its student.userName 
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async getMyStudents(req: Request, res: Response){
        const moderatorId = req.params.id
        try{
            res.send(await this.userService.getMyStudents(moderatorId))
        }catch(err){
            this.handleException(err,res)
        }
    }


     /**
     * login allows to login a moderator
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async login(req: Request, res: Response) {
        try{
            const userLogged = await this.userService.login({
                type: MODERATOR_AUTHORIZATION,
                userName: req.body.userName,
                password: req.body.password
            } as UserLoginDto);

            res.send(userLogged)

        }catch(err){
            this.handleException(err,res)
        }
    }

     /**
     * createModerator allows to create a new moderator
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async createModerator(req: Request, res: Response){
        
        try{
            const userCreated = await this.userService.store({
                type: MODERATOR_AUTHORIZATION,
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
     * updateModerator allows to update a moderator
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async updateModerator(req: Request, res: Response){
        const id = req.params.id

        try{
            const userUpdated = await this.userService.update({
                type: MODERATOR_AUTHORIZATION,
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
     * updateModerator allows to delete a moderator
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async deleteModerator(req: Request, res: Response){
        const id = req.params.id

        try{
            const userUpdated = await this.userService.delete(id);
            res.send(userUpdated);
        }catch(err){
            this.handleException(err,res)
        }
    }

}

export {ModeratorController}