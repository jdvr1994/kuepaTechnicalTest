import { ClassService } from "../services/class.service";
import { UserService } from "../services/user.service"
import MockDataBaseSingleton  from "../utils/persistence/mock.persistence";
import { ClassMockRepository } from "../services/repositories/implementation/mock/class.repository";
import { UserMockRepository } from "../services/repositories/implementation/mock/user.repository";
import { UserCreateDto, UserLoginDto } from "../dtos/user.dto";
import { STUDENT_AUTHORIZATION } from "../config";
import assert from "assert";

const classService = new ClassService(new ClassMockRepository(),new UserMockRepository());
const userService = new UserService(new UserMockRepository(), new ClassMockRepository());
const mockDataBase = MockDataBaseSingleton.getInstance();
mockDataBase.initializeMockDataBase();

/**
 * Test the no-generic methods for the student entity
 */
describe('Test the methods for a student', () => {
    
    /**
     * Test A1 - Create a new student
     * The student should be registered without problems
     */
    test('Create a new student', async () => {
        const user = await userService.store({
            type: STUDENT_AUTHORIZATION,
            names: "Juan Danilo",
            lastNames: "Perez Calvache",
            userName: "juanDaPe",
            password: "adbc!1234",
            phone: "3158280699",
        } as UserCreateDto)

    });

    /**
     * Test A2 - Login the previous student
     * The student should login without problems and get the token (Auth)
     */
    test('Login student', async () => {
        const user = await userService.login({
            type: STUDENT_AUTHORIZATION,
            userName: "juanDaPe",
            password: "adbc!1234",
        } as UserLoginDto)

        assert.equal(user.token!=undefined,true,'The token was not generated. Authorization failed')
    });

    /**
     * Test A3 - Check login history for a student
     * Create a new student, login a lot of times and check the login history
     */
    test('Check login history for a student', async () => {
        const loginTimes = 10;

        let user = await userService.store({
            type: STUDENT_AUTHORIZATION,
            names: "Camila",
            lastNames: "Velasquez",
            userName: "camiVela",
            password: "adbc!1234",
            phone: "3158280699",
        } as UserCreateDto)

        const loginBody = {
            type: STUDENT_AUTHORIZATION,
            userName: "camiVela",
            password: "adbc!1234",
        } as UserLoginDto;

        for (let index = 0; index < loginTimes; index++) 
            await userService.login(loginBody)

        const loginHistory = (await userService.find(user.id,STUDENT_AUTHORIZATION)).login_at
        assert.equal(loginHistory.length,loginTimes+1,'The token was not generated. Authorization failed')
    });
});