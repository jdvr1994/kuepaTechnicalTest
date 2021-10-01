import assert from "assert";
import { ClassService } from "../services/class.service";
import MockDataBaseSingleton  from "../utils/persistence/mock.persistence";
import { ClassMockRepository } from "../services/repositories/implementation/mock/class.repository";
import { UserMockRepository } from "../services/repositories/implementation/mock/user.repository";
import { ClassCreateDto, ClassLikeDto, ClassSubscribeDto } from "../dtos/class.dto";

const classService = new ClassService(new ClassMockRepository(),new UserMockRepository())
const mockDataBase = MockDataBaseSingleton.getInstance();


beforeEach(() => {
    return mockDataBase.initializeMockDataBase();
});

/**
 * Test the classes creation process 
 */
describe('Test the classes creation process', () => {
    // Applies only to tests in this describe block
    beforeEach(() => {
        return mockDataBase.initializeMockDataBase();
    });

    /**
     * Test A1 - Create a class with a valid moderator
     * The class should be created successfully
     */
    test('Create a class with a valid moderator', async () => {
        const _class = await classService.store({
            id: "--",
            title: "Adiestramiento canino - Bases",
            description: "Es la primera clase sobre adiestramiento canino",
            startDate: new Date(Date.UTC(2021, 10, 1, 9, 0, 0)),
            endDate: new Date(Date.UTC(2021, 10, 1, 10, 0, 0)),
            moderator: "615625717c46544d2868e2f8",
        } as ClassCreateDto)

    });

    /**
     * Test A2 - Create a class with a invalid moderator
     * The class should not be created successfully
     * The message "The moderator does not exist!" should be shown
     */
    test('Create a class with a invalid moderator', async () => {
        try {
            const _class = await classService.store({
                id: "--",
                title: "Adiestramiento canino - Bases",
                description: "Es la primera clase sobre adiestramiento canino",
                startDate: new Date(Date.UTC(2021, 10, 1, 9, 0, 0)),
                endDate: new Date(Date.UTC(2021, 10, 1, 11, 0, 0)),
                moderator: "615625717c46544d2868e2f0",
            } as ClassCreateDto)
    
            assert.equal(!_class,true,'The class was created with invalid moderator')
        } catch (err: any) {
            assert.equal(err.message, 'The moderator does not exist!')
        }

    });

     /**
     * Test A3 - Create two classes with the same moderator on collided time range (collision)
     * The second class should not be created successfully
     * The message "A class already exists with this moderator at this time." should be shown
     */
    test('Create two classes with the same moderator on collided time range (collision)', async () => {
        try {
            const _class1 = await classService.store({
                id: "--",
                title: "Adiestramiento canino - Bases",
                description: "Es la primera clase sobre adiestramiento canino",
                startDate: new Date(Date.UTC(2021, 10, 1, 9, 0, 0)),
                endDate: new Date(Date.UTC(2021, 10, 1, 11, 0, 0)),
                moderator: "615625717c46544d2868e2f8",
            } as ClassCreateDto)

            const _class2 = await classService.store({
                id: "--",
                title: "Adiestramiento canino - Fase 2",
                description: "Es la segunda clase sobre adiestramiento canino",
                startDate: new Date(Date.UTC(2021, 10, 1, 8, 0, 0)),
                endDate: new Date(Date.UTC(2021, 10, 1, 10, 15, 0)),
                moderator: "615625717c46544d2868e2f8",
            } as ClassCreateDto)
    
            assert.equal(!_class2,true,'The class was created but it collides with other class')
        } catch (err: any) {
            assert.equal(err.message, 'A class already exists with this moderator at this time.')
        }

    });


    /**
     * Test A3 - Create two classes with two moderators at the same time (no collision)
     * The second class should be created successfully
     */
    test('Create two classes with two moderators at the same time (no collision)', async () => {
        const _class1 = await classService.store({
            id: "--",
            title: "Adiestramiento canino - Bases",
            description: "Es la primera clase sobre adiestramiento canino",
            startDate: new Date(Date.UTC(2021, 10, 1, 9, 0, 0)),
            endDate: new Date(Date.UTC(2021, 10, 1, 11, 0, 0)),
            moderator: "615625717c46544d2868e2f8",
        } as ClassCreateDto)

        const _class2 = await classService.store({
            id: "--",
            title: "Adiestramiento canino - Fase 2",
            description: "Es la segunda clase sobre adiestramiento canino",
            startDate: new Date(Date.UTC(2021, 10, 1, 9, 0, 0)),
            endDate: new Date(Date.UTC(2021, 10, 1, 11, 15, 0)),
            moderator: "615625717c46544d2868e2f9",
        } as ClassCreateDto)

        assert.equal(!!_class1 && !!_class2,true,'A class was not created')
    });

    /**
     * Test A4 - Create multiple classes and verify the classes of the moderators
     * The classes should be completed successfully and 
     * the findByModerator method should find all the created classes for each one
     */
    test('Create multiple classes and verify the classes of the moderators', async () => {
        const classesForModerator1 = 10;
        const classesForModerator2 = 20;
        const moderator1 = "615625717c46544d2868e2f8"
        const moderator2 = "615625717c46544d2868e2f9"

        let commonClassFields = {
            id: "--",
            title: "Nodejs",
            description: "Esta es una clase sobre Nodejs",
        } as ClassCreateDto;

        for (let index = 0; index < classesForModerator1; index++) {
            commonClassFields.startDate = new Date(Date.UTC(2021, 10, 1, 0+index, 0, 0));
            commonClassFields.endDate = new Date(Date.UTC(2021, 10, 1, 1+index, 0, 0));
            commonClassFields.moderator = moderator1;
            await classService.store(commonClassFields)
        }


        for (let index = 0; index < classesForModerator2; index++) {
            commonClassFields.startDate = new Date(Date.UTC(2021, 10, 1, 0+index, 0, 0));
            commonClassFields.endDate = new Date(Date.UTC(2021, 10, 1, 1+index, 0, 0));
            commonClassFields.moderator = moderator2;
            await classService.store(commonClassFields)
        }

        const moderator1Classes = await classService.findByModerator(moderator1);
        const moderator2Classes = await classService.findByModerator(moderator2);

        assert.equal(moderator1Classes.length,classesForModerator1,'The number of classes for the moderator 1 is not correct!')
        assert.equal(moderator2Classes.length,classesForModerator2,'The number of classes for the moderator 2 is not correct!')
    });
});

/**
 * Test the subscription process.
 * The purpose of these tests is to verify differents conditions in which a student is subscribed to a class 
 */
describe('Test the subscription process', () => {
    // Applies only to tests in this describe block
    beforeEach(() => {
        return mockDataBase.initializeMockDataBase();
    });

    /**
     * Test B1 - Create a class and subscribe a student
     * A class is created and we tried subscribe a student to it.
     * The student should be subscribed successfully
     */
    test('Create a class and subscribe a student', async () => {
        const studentId = "615625717c46544d2868e2f7"

        let _class1 = await classService.store({
            id: "--",
            title: "Robotica - Bases",
            description: "Es la primera clase sobre robotica",
            startDate: new Date(Date.UTC(2021, 10, 1, 9, 0, 0)),
            endDate: new Date(Date.UTC(2021, 10, 1, 11, 0, 0)),
            moderator: "615625717c46544d2868e2f8",
        } as ClassCreateDto)

        _class1 = await classService.subscribeToClass({
            classId: _class1.id,
            userId: studentId
        } as ClassSubscribeDto);

        const studentInClass = _class1.students.find((student) => student === studentId)
        assert.equal(studentInClass != undefined,true,'The student was not subscribed to the class')
    });

    /**
     * Test B2 - Create a class and subscribe multiple times the same student
     * A class is created and we tried subscribe multiple times the same student to it.
     * The student should be subscribed successfully without duplicated entities
     */
    test('Create a class and subscribe multiple times the same student', async () => {
        const subscribtionTimes = 15;
        const studentId = "615625717c46544d2868e2f7"

        let _class1 = await classService.store({
            id: "--",
            title: "Robotica - Bases",
            description: "Es la primera clase sobre robotica",
            startDate: new Date(Date.UTC(2021, 10, 1, 9, 0, 0)),
            endDate: new Date(Date.UTC(2021, 10, 1, 11, 0, 0)),
            moderator: "615625717c46544d2868e2f8",
        } as ClassCreateDto)

        for (let index = 0; index < subscribtionTimes; index++) 
            _class1 = await classService.subscribeToClass({ classId: _class1.id, userId: studentId} as ClassSubscribeDto);

        const studentInClass = _class1.students.filter((student) => student === studentId)
        assert.equal(studentInClass.length,1,'The student was subscribed to the class more than 1 times')
    });


    /**
     * Test B3 - Create a class and subscribe multiple students during multiple times
     * A class is created and we tried subscribe multiple times differents student to it.
     * The students should be subscribed successfully without duplicated entities
     */
    test('Create a class and subscribe multiple students a lot of times', async () => {
        const subscribtionTimes1 = 10;
        const subscribtionTimes2 = 20;
        const studentId1 = "615625717c46544d2868e2f7"
        const studentId2 = "615625717c46544d2868e2f10"

        let _class1 = await classService.store({
            id: "--",
            title: "Robotica - Bases",
            description: "Es la primera clase sobre robotica",
            startDate: new Date(Date.UTC(2021, 10, 1, 9, 0, 0)),
            endDate: new Date(Date.UTC(2021, 10, 1, 11, 0, 0)),
            moderator: "615625717c46544d2868e2f8",
        } as ClassCreateDto)

        for (let index = 0; index < subscribtionTimes1; index++) 
            _class1 = await classService.subscribeToClass({ classId: _class1.id, userId: studentId1} as ClassSubscribeDto);

        for (let index = 0; index < subscribtionTimes2; index++) 
            _class1 = await classService.subscribeToClass({ classId: _class1.id, userId: studentId2} as ClassSubscribeDto);

        const student1InClass = _class1.students.filter((student) => student === studentId1)
        const student2InClass = _class1.students.filter((student) => student === studentId2)
        assert.equal(student1InClass.length,1,'The student was subscribed to the class more than 1 times')
        assert.equal(student2InClass.length,1,'The student was subscribed to the class more than 1 times')
    });

    /**
     * Test B4 - Create a class and subscribe a non-existent student
     * A class is created and we tried subscribe a non-existent student to it.
     * The student subscription should be rejected and it should be shown the message "The student does not exist!"
     */
    test('Create a class and subscribe a student', async () => {
        const studentId = "615625717c46544d2868e2f0"

        try{
            let _class1 = await classService.store({
                id: "--",
                title: "Robotica - Bases",
                description: "Es la primera clase sobre robotica",
                startDate: new Date(Date.UTC(2021, 10, 1, 9, 0, 0)),
                endDate: new Date(Date.UTC(2021, 10, 1, 11, 0, 0)),
                moderator: "615625717c46544d2868e2f8",
            } as ClassCreateDto)
    
            _class1 = await classService.subscribeToClass({
                classId: _class1.id,
                userId: studentId
            } as ClassSubscribeDto);
    
            const studentInClass = _class1.students.find((student) => student === studentId)
            assert.equal(studentInClass == undefined,true,'The non-existent student was subscribed to the class')
        }catch(err: any){
            assert.equal(err.message, 'The student does not exist!')
        }
    });

    /**
     * Test B5 - Create multiple classes and subscribe a student to all the classes
     * *** Test the findByStudent method
     * The student subscriptions should be completed successfully and 
     * the findByStudent method should find all the subscribed classes
     */
    test('Create multiple classes and subscribe a student to all the classes', async () => {
        const numberOfClasses = 10;
        const studentId = "615625717c46544d2868e2f7"

        let commonClassFields = {
            id: "--",
            title: "Nodejs",
            description: "Esta es una clase sobre Nodejs",
            moderator: "615625717c46544d2868e2f8"
        } as ClassCreateDto;

        for (let index = 0; index < numberOfClasses; index++) {
            commonClassFields.startDate = new Date(Date.UTC(2021, 10, 1, 0+index, 0, 0));
            commonClassFields.endDate = new Date(Date.UTC(2021, 10, 1, 1+index, 0, 0));
            const myClass = await classService.store(commonClassFields)
            await classService.subscribeToClass({ classId: myClass.id, userId: studentId} as ClassSubscribeDto);
        }

        const studentClasses = await classService.findByStudent(studentId);
        assert.equal(studentClasses.length,numberOfClasses,'it was not found all the subscriptions')
    });

});


/**
 * Test E1 - Test getInteracctions method
 * A class is created, two students are subscribed to it 
 * both students send likes in this class
 * The number of interactions should be the correct for each student 
 */
test('Test getInteracctions method', async () => {
    const likesStundent1 = 50;
    const likesStundent2 = 100;
    const studentId1 = "615625717c46544d2868e2f7"
    const studentId2 = "615625717c46544d2868e2f10"

    let _class1 = await classService.store({
        id: "--",
        title: "Robotica - Bases",
        description: "Es la primera clase sobre robotica",
        startDate: new Date(Date.UTC(2021, 10, 1, 9, 0, 0)),
        endDate: new Date(Date.UTC(2021, 10, 1, 11, 0, 0)),
        moderator: "615625717c46544d2868e2f8",
    } as ClassCreateDto)

    _class1 = await classService.subscribeToClass({ classId: _class1.id, userId: studentId1} as ClassSubscribeDto);
    _class1 = await classService.subscribeToClass({ classId: _class1.id, userId: studentId2} as ClassSubscribeDto);

    for (let index = 0; index < likesStundent1; index++) 
        await classService.sendLike({ classId: _class1.id, userId: studentId1} as ClassLikeDto);

    for (let index = 0; index < likesStundent2; index++) 
        await classService.sendLike({ classId: _class1.id, userId: studentId2} as ClassLikeDto);
    

    const interactionReport = await classService.getInteractions(_class1.id)

    assert.equal(interactionReport.interactions[studentId1],likesStundent1,'The number of interactions for the student1 is wrong')
    assert.equal(interactionReport.interactions[studentId2],likesStundent2,'The number of interactions for the student1 is wrong')
});