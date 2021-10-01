import { Router } from 'express';
import ModeratorRouter from './moderator.routes';
import StudentRouter from './student.routes';
import ClassRouter from './class.routes';

/**
 * MainRouter is used to configure and manage all the routes
 */
class MainRouter{
    public routes = Router();

    // Instances of subRouters
    private instanceModeratorRouter = new ModeratorRouter();
    private instanceStudentRouter = new StudentRouter();
    private instanceClassRouter = new ClassRouter();

    /**
     * It is a symple constructor
     */
    constructor(){}

    /**
     *setRouters is used to set the diferents endPoint of the API
     */
    setRouters(){
        this.routes.use('/moderator', this.instanceModeratorRouter.routes());
        this.routes.use('/student', this.instanceStudentRouter.routes());
        this.routes.use('/class', this.instanceClassRouter.routes());
    }
}



export default MainRouter;