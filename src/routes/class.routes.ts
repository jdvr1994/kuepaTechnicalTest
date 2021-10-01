import { Router, Request, Response} from "express";
import { ADMIN_AUTHORIZATION, MODERATOR_AUTHORIZATION,STUDENT_AUTHORIZATION } from "../config";
import { ClassController } from "../controllers/class.controller";
import { isAuth } from "../middlewares/authJsonToken.middleware";
const {projectContainer} = require('../container')

// Roles to verify the authentication level.
const authAdmin = [ADMIN_AUTHORIZATION]
const authModerator  = [MODERATOR_AUTHORIZATION]
const authStudent  = [STUDENT_AUTHORIZATION]
const authAll   = [ADMIN_AUTHORIZATION, MODERATOR_AUTHORIZATION, STUDENT_AUTHORIZATION]

/**
 * ClassRouter is used to manage the class routes
 * @classRouter is the router object
 * @instanceController is a instance of the ClassController to manage the response of the routesAPI.
 */
class ClassRouter{
    public classRouter: Router;
    public instanceController: ClassController = projectContainer.resolve('classController');

    /**
     * It is a symple constructor
     */
    constructor(){
        this.classRouter = Router();
    }

    /**
     * routes is used to set the diferents endPoint of the Class API
     * isAuth(level) is used to manage the authentication process (JSONWebToken with levels)
     */
    public routes():Router{

        this.classRouter.get('/', isAuth(authAll),this.instanceController.getAllClasses); // Get all classes
        this.classRouter.get('/:id', isAuth(authAll), this.instanceController.getClass); // Get class by Id
        this.classRouter.get('/moderator/:id', isAuth(authModerator), this.instanceController.getClassesByModerator); // Get class by moderatorId
        this.classRouter.get('/student/:id', isAuth(authAll), this.instanceController.getClassesByStudent); // Get class by studentId
        this.classRouter.get('/:id/interactions', isAuth(authModerator), this.instanceController.getInteractions); // Get a interactions student report for a specificaly class
        this.classRouter.post('/', isAuth(authModerator), this.instanceController.createClass); // Register a class
        this.classRouter.put('/:id/subscribe-student', isAuth(authStudent), this.instanceController.subscribeToClass); // Subscribe a student to a specifically class
        this.classRouter.put('/:id/like', isAuth(authStudent), this.instanceController.sendLike); // Used to send a like (by student) to a class
        this.classRouter.put('/:id', isAuth(authModerator), this.instanceController.updateClass); // Update a class by Id
        this.classRouter.delete('/:id', isAuth(authAdmin), this.instanceController.deleteClass); // Delete a class by Id

        return this.classRouter;
    }
}

export default ClassRouter;