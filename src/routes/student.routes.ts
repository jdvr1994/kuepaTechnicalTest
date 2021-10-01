import { Router, Request, Response} from "express";
import { ADMIN_AUTHORIZATION, MODERATOR_AUTHORIZATION,STUDENT_AUTHORIZATION } from "../config";
import { StudentController } from "../controllers/student.controller";
import { isAuth } from "../middlewares/authJsonToken.middleware";
const {projectContainer} = require('../container')

const authAdmin = [ADMIN_AUTHORIZATION]
const authModerator  = [MODERATOR_AUTHORIZATION]
const authStudent  = [STUDENT_AUTHORIZATION]
const authAll   = [ADMIN_AUTHORIZATION, MODERATOR_AUTHORIZATION, STUDENT_AUTHORIZATION]

/**
 * StudentRouter is used to manage the student routes
 * @moderatorRouter is the router object
 * @instanceController is a instance of the StudentController to manage the response of the studentAPI.
 */
class StudentRouter{
    public studentRouter: Router;
    public instanceController: StudentController = projectContainer.resolve('studentController');

    /**
     * It is a symple constructor
     */
    constructor(){
        this.studentRouter = Router();
    }

    /**
     * routes is used to set the diferents endPoint of the Student API
     * isAuth(level) is used to manage the authentication process (JSONWebToken with levels)
     */
    public routes():Router{

        this.studentRouter.get('/', isAuth(authAll),this.instanceController.getAllStudents); // Get all students
        this.studentRouter.get('/:id', isAuth(authAll), this.instanceController.getStudent); // Get student by Id
        this.studentRouter.post('/', this.instanceController.createStudent); //Register student
        this.studentRouter.post('/login', this.instanceController.login); //Login (get Auth) for student
        this.studentRouter.get('/:id/login-history', isAuth(authAll), this.instanceController.getLogginHistory);  //Get login history by studentId
        this.studentRouter.put('/:id', isAuth(authAll), this.instanceController.updateStudent); //Update student
        this.studentRouter.delete('/:id', isAuth(authAdmin), this.instanceController.deleteStudent); //Update student

        return this.studentRouter;
    }
}

export default StudentRouter;