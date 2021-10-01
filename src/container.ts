import {asClass, AwilixContainer, createContainer, InjectionMode} from "awilix"
import { ClassController } from "./controllers/class.controller";
import { ModeratorController } from "./controllers/moderator.controller";
import { StudentController } from "./controllers/student.controller";
import { ClassService } from "./services/class.service";
import { ClassMongooseRepository} from "./services/repositories/implementation/mongoose/class.repository"
import { UserMongooseRepository } from "./services/repositories/implementation/mongoose/user.repository";
import { UserService } from "./services/user.service";

/**
 * This is the administrator to dependencies injection
 */
const projectContainer:AwilixContainer = createContainer({
    injectionMode: InjectionMode.CLASSIC
});

function setConteiner():void{
    projectContainer.register({
        // Repositories
        classRepository: asClass(ClassMongooseRepository).scoped(),
        userRepository: asClass(UserMongooseRepository).scoped(),

        // Controllers and Services
        studentController: asClass(StudentController).scoped(),
        moderatorController: asClass(ModeratorController).scoped(),
        userService: asClass(UserService).scoped(),
        
        classController: asClass(ClassController).scoped(),
        classService: asClass(ClassService).scoped(),
    });

    console.log("Conteiner setted");
}

export{projectContainer, setConteiner}