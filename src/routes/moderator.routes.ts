import { Router, Request, Response} from "express";
import { ADMIN_AUTHORIZATION, MODERATOR_AUTHORIZATION,STUDENT_AUTHORIZATION } from "../config";
import { ModeratorController } from "../controllers/moderator.controller";
import { isAuth } from "../middlewares/authJsonToken.middleware";
const {projectContainer} = require('../container')

const authAdmin = [ADMIN_AUTHORIZATION]
const authModerator  = [MODERATOR_AUTHORIZATION]
const authStudent  = [STUDENT_AUTHORIZATION]
const authAll   = [ADMIN_AUTHORIZATION, MODERATOR_AUTHORIZATION, STUDENT_AUTHORIZATION]

/**
 * ModeratorRouter is used to manage the moderator routes
 * @moderatorRouter is the router object
 * @instanceController is a instance of the ModeratorController to manage the response of the moderatorAPI.
 */
class ModeratorRouter{
    public moderatorRouter: Router;
    public instanceController: ModeratorController = projectContainer.resolve('moderatorController');

    /**
     * It is a symple constructor
     */
    constructor(){
        this.moderatorRouter = Router();
    }

    /**
     * routes is used to set the diferents endPoint of the Moderator API
     * isAuth(level) is used to manage the authentication process (JSONWebToken with levels)
     */
    public routes():Router{

        this.moderatorRouter.get('', isAuth(authModerator),this.instanceController.getAllModerators); // Get all moderator
        this.moderatorRouter.get('/:id', isAuth(authModerator), this.instanceController.getModerator); // Get moderator by Id
        this.moderatorRouter.post('/', this.instanceController.createModerator); //Register moderator
        this.moderatorRouter.post('/login', this.instanceController.login); //Login (get Auth) for moderators
        this.moderatorRouter.get('/:id/my-students', isAuth(authModerator), this.instanceController.getMyStudents); //Get all students by moderatorId
        this.moderatorRouter.put('/:id', isAuth(authModerator), this.instanceController.updateModerator); //Update moderator
        this.moderatorRouter.delete('/:id', isAuth(authAdmin), this.instanceController.deleteModerator); //Delete moderator

        return this.moderatorRouter;
    }
}

export default ModeratorRouter;