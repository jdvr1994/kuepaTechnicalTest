import { ClassService } from "../services/class.service";
import { UserService } from "../services/user.service"
import MockDataBaseSingleton  from "../utils/persistence/mock.persistence";
import { ClassMockRepository } from "../services/repositories/implementation/mock/class.repository";
import { UserMockRepository } from "../services/repositories/implementation/mock/user.repository";
import { UserCreateDto, UserLoginDto } from "../dtos/user.dto";
import { MODERATOR_AUTHORIZATION, STUDENT_AUTHORIZATION } from "../config";
import assert from "assert";
import { IUser } from "../services/repositories/domain/user";
import { ClassCreateDto, ClassSubscribeDto } from "../dtos/class.dto";

const classService = new ClassService(new ClassMockRepository(),new UserMockRepository());
const userService = new UserService(new UserMockRepository(), new ClassMockRepository());
const mockDataBase = MockDataBaseSingleton.getInstance();
mockDataBase.initializeMockDataBase();

/**
 * Test the no-generic methods for the moderator entity
 */
describe('Test the methods for a student', () => {
    
    /**
     * Test A1 - Create a new moderator
     * The moderator should be registered without problems
     */
    test('Create a new moderator', async () => {
        const user = await userService.store({
            type: MODERATOR_AUTHORIZATION,
            names: "Rodrigo",
            lastNames: "Angúlo",
            userName: "rodriAng",
            password: "adbc!1234",
            phone: "3158280699",
        } as UserCreateDto)

    });

    /**
     * Test A1 - Login the previous moderator
     * The moderator should login without problems and get the token (Auth)
     */
    test('Login moderator', async () => {
        const user = await userService.login({
            type: MODERATOR_AUTHORIZATION,
            userName: "rodriAng",
            password: "adbc!1234",
        } as UserLoginDto)

        assert.equal(user.token!=undefined,true,'The token was not generated. Authorization failed')
    });

    /**
     * Test A3 - GetMyStudents
     * Create a new class, subscribe multiple students to this class,
     * Check the list of the students
     */
    test('Get list of students for a moderator', async () => {
        const numberOfUsers = 20;
        const moderatorId = "615625717c46544d2868e2f8"
        

        //Create a new classes
        let _class1 = await classService.store({
            id: "--",
            title: "Robotica - Bases",
            description: "Es la primera clase sobre robotica",
            startDate: new Date(Date.UTC(2021, 10, 1, 9, 0, 0)),
            endDate: new Date(Date.UTC(2021, 10, 1, 11, 0, 0)),
            moderator:moderatorId,
        } as ClassCreateDto)

        let _class2 = await classService.store({
            id: "--",
            title: "Robotica - Bases",
            description: "Es la primera clase sobre robotica",
            startDate: new Date(Date.UTC(2021, 10, 1, 13, 0, 0)),
            endDate: new Date(Date.UTC(2021, 10, 1, 15, 0, 0)),
            moderator: moderatorId,
        } as ClassCreateDto)

        // Create multiple students
        let userInfo = {
            type: STUDENT_AUTHORIZATION,
            names: "Juan Danilo",
            lastNames: "Perez Calvache",
            userName: "studentA",
            password: "adbc!1234",
            phone: "3158280699",
        } as UserCreateDto;

        //Subscribe the user 
        for (let index = 0; index < numberOfUsers; index++) {
            userInfo.userName += index;
            const user: IUser = await userService.store(userInfo)
            await classService.subscribeToClass({ classId: index%2? _class1.id: _class2.id, userId: user.id} as ClassSubscribeDto);
        }

        const students = await userService.getMyStudents(moderatorId)
        assert.equal(students.length,numberOfUsers,'The number of students for this moderator is wrong')

    });
});