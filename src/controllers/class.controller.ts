import { Request, Response } from "express";
import { ClassCreateDto, ClassSubscribeDto, ClassUpdateDto, ClassLikeDto } from "../dtos/class.dto";
import { ClassService } from "../services/class.service";
import { BaseController } from "../utils/controllers/base.controller";

/**
 * Controller to manage the class routes
 * extend of BaseController in order to manage the appExceptions
 */
class ClassController extends BaseController{
    
    private readonly classService: ClassService

    /**
     * Constructor ClassController
     * @param classService is used to abstract the manage operations with the repositorios
     */
    constructor(classService: ClassService){
        super();
        this.classService = classService;
        this.getAllClasses = this.getAllClasses.bind(this)
        this.getClass = this.getClass.bind(this)
        this.getInteractions = this.getInteractions.bind(this)
        this.createClass = this.createClass.bind(this)
        this.updateClass = this.updateClass.bind(this)
        this.deleteClass = this.deleteClass.bind(this)
        this.subscribeToClass = this.subscribeToClass.bind(this)
        this.sendLike = this.sendLike.bind(this)
        this.getClassesByModerator = this.getClassesByModerator.bind(this)
        this.getClassesByStudent = this.getClassesByStudent.bind(this)
    }

    /**
     * getAllClasses allows to get all the classes without filters
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async getAllClasses(req: Request, res: Response){
        try{
            res.send(await this.classService.all())
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * getClass allows to get a class by Id
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async getClass(req: Request, res: Response){
        const classId = req.params.id
        
        try{
            res.send(await this.classService.find(classId))
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * getClassesByModerator allows to get all the classes by ModeratorId
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async getClassesByModerator(req: Request, res: Response){
        const moderatorId = req.params.id
        
        try{
            res.send(await this.classService.findByModerator(moderatorId))
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * getClassesByStudent allows to get all the classes of a Student
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async getClassesByStudent(req: Request, res: Response){
        const studentId = req.params.id
        
        try{
            res.send(await this.classService.findByStudent(studentId))
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * getInteractions allows to get a report of the student intetaction for a specificaly class
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async getInteractions(req: Request, res: Response){
        const classId = req.params.id
        
        try{
            res.send(await this.classService.getInteractions(classId))
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * createClass allows to create a new class. A moderatorId is required.
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async createClass(req: Request, res: Response){
        try{
            const classCreated = await this.classService.store({
                title: req.body.title,
                description: req.body.description,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
                moderator: req.body.moderator
            } as ClassCreateDto);

            res.send(classCreated);
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * subscribeToClass allows to subscribe a student to a class.
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async subscribeToClass(req: Request, res: Response){
        const classId = req.params.id

        try{
            const classCreated = await this.classService.subscribeToClass({
                classId: classId,
                userId: req.body.userId
            } as ClassSubscribeDto);

            res.send(classCreated);
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * sendLike allows to send a like a store it on the class.likes.
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async sendLike(req: Request, res: Response){
        const classId = req.params.id

        try{
            const classCreated = await this.classService.sendLike({
                classId: classId,
                userId: req.body.userId
            } as ClassLikeDto);

            res.send(classCreated);
        }catch(err){
            this.handleException(err,res)
        }
    }

     /**
     * updateClass allows to update a class
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async updateClass(req: Request, res: Response){
        const classId = req.params.id

        try{
            const classUpdated = await this.classService.update({
                id: classId,
                title: req.body.title,
                description: req.body.description
            } as ClassUpdateDto);
            
            res.send(classUpdated);
        }catch(err){
            this.handleException(err,res)
        }
    }

    /**
     * deleteClass allows to delete a class
     * @param req requestObject received from API
     * @param res resObject sent to API
     */
    public async deleteClass(req: Request, res: Response){
        const id = req.params.id

        try{
            const classUpdated = await this.classService.delete(id);
            res.send(classUpdated);
        }catch(err){
            this.handleException(err,res)
        }
    }

}

export {ClassController}