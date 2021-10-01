import { IClass, IReportClassInteractions, IExtendedClass, Like } from "../../domain/class";
import { ClassRepository } from "../../class.repository";
import { MODERATOR_AUTHORIZATION, STUDENT_AUTHORIZATION } from "../../../../config";
import MockDataBaseSingleton from "../../../../utils/persistence/mock.persistence"
import { IUser } from "../../domain/user";

const mockDataBase = MockDataBaseSingleton.getInstance();

/**
 * ClassMongooseRepository is the repository to manage of direct way the communication with the MOCK database (mock.persistence)
 * ClassRepository is the contract signed by all the Repositories (for Class)
 */
export class ClassMockRepository implements ClassRepository{
    
    /**
     * all - used to get all classes from database
     */
    public async all():Promise<IClass[]>{
        const classes = mockDataBase.getDataBase().classes;
        return Object.assign([...classes]) as IClass[]
    }

    /**
     * find - used to get a class by Id from database
     */
    public async find(id: string):Promise<IClass>{
        const classes = mockDataBase.getDataBase().classes as IClass[];
        const _class = classes.find(x => x.id === id);
        return _class as IClass
    }

     /**
     * findByModerator - used to get a class by moderatorId from database
     * @param moderatorId is the id of moderator
     */
    public async findByModerator(moderatorId: string):Promise<IExtendedClass[]>{
        const users = mockDataBase.getDataBase().users as IUser[];
        const classes = mockDataBase.getDataBase().classes as IClass[];
        const classesFound = classes.filter(x => x.moderator === moderatorId);

        const classesFoundExtended: IExtendedClass[] = classesFound.map((myClass)=>{
            return { 
                _id: myClass.id,
                id: myClass.id,
                title: myClass.title,
                description: myClass.description,
                startDate: myClass.startDate,
                endDate: myClass.endDate,
                moderator: myClass.moderator,
                //populate myClass.students
                students: myClass.students? myClass.students.map((student)=>{
                    const studentComplete = users.find((x)=>x.id === student) as IUser;
                    if(studentComplete) return studentComplete;
                }) : [],
                likes: myClass.likes,
                created_at: myClass.created_at,
                updated_at: myClass.updated_at

            } as IExtendedClass;
        })

        return Object.assign([...classesFoundExtended]) as IExtendedClass[]
    }

    /**
     * findByStudent - used to get a class by @studentId from database
     * @param studentId 
     */
    public async findByStudent(studentId: string):Promise<IClass[]>{

        const classes = mockDataBase.getDataBase().classes as IClass[];
        const classesFound = classes.filter(_class => {
            return _class.students.find(student => student === studentId)
        });
 
        return Object.assign([...classesFound]) as IClass[]
    }

    /**
     * checkSchedulableClass allows to check if the time range is available to schedule a new class
     * @param userId : id of the user that it want to know if it is available
     * @param type : type of the user (moderator, student)
     * @param startDate: start time for the class
     * @param endDate:  end time for the class
     */
    public async checkSchedulableClass(userId: string, type: string, startDate: Date, endDate: Date): Promise<IClass[]> {
       
        const classes = mockDataBase.getDataBase().classes as IClass[];

        let classesScheduled = classes.filter( _class =>{
            return (startDate >= _class.startDate && startDate < _class.endDate) || (endDate > _class.startDate && endDate <= _class.endDate) || (endDate >= _class.endDate && startDate <= _class.startDate)
        })

        if(type === MODERATOR_AUTHORIZATION) {
            classesScheduled = classesScheduled.filter(_class => {
                return _class.moderator === userId;
            });
        }

        if(type === STUDENT_AUTHORIZATION) {
            classesScheduled = classesScheduled.filter(_class => {
                return _class.students.find(student => student === userId)
            });
        }

        return classesScheduled as IClass[]

    }

    /**
     * getInteractions is used to get a report of the student interaction for a specifically class
     * @param id: id of the class for analysis
     */
    public async getInteractions(id: string): Promise<IReportClassInteractions | null> {
        const classes = mockDataBase.getDataBase().classes as IClass[];
        const _class = classes.find((x: IClass) => x.id === id);
        
        if(_class){
            const reportClassInteractions: IReportClassInteractions = {} as IReportClassInteractions;
            
            const reducer = (contadorLikes: any = {}, like: Like) => {
                contadorLikes[like.student] = (contadorLikes[like.student] || 0) + 1;
                return contadorLikes;
            }

            reportClassInteractions.classId = _class.id;
            if(_class.likes.length > 0) reportClassInteractions.interactions = _class.likes.reduce(reducer, {});
            else reportClassInteractions.interactions = {}
            
            return reportClassInteractions as IReportClassInteractions
        }else{
            return null;
        }
        
    }

    /**
     * store is used to create a new class
     * @param _class contains the data to store in the database
     */
    public async store(_class: IClass):Promise<IClass>{
        const classes = mockDataBase.getDataBase().classes as any;
        _class.created_at = new Date();
        _class.id = "laldhausdhuasidas"+ Math.random()*100;
        
        classes.push({
            id: _class.id,
            title: _class.title,
            description: _class.description,
            startDate: _class.startDate,
            endDate: _class.endDate,
            moderator: _class.moderator,
            created_at: _class.created_at,
            updated_at: null
        } as IClass);

        return _class as IClass
    }

    /**
     * subscribeStudent allows to subscribe a student to a class
     * @param classId: id of the class
     * @param userId: id of the student
     */
    public async subscribeStudent(classId: string, userId:string):Promise<IClass> {
        const classes = mockDataBase.getDataBase().classes as IClass[];
        const myClass = classes.find(x => x.id === classId);

        if(myClass){
            if(!myClass.students) myClass.students = []
            myClass.students.indexOf(userId) === -1 ? myClass.students.push(userId) : ()=>{};
        }

        return Object.assign({...myClass}) as IClass
    }

    /**
     * addLike allows to add a new like to a class
     * @param classId: id of the class
     * @param userId: id of the student
     */
    public async addLike(classId: string, userId:string):Promise<IClass> {

        const classes = mockDataBase.getDataBase().classes as IClass[];
        const myClass = classes.find(x => x.id === classId);

        if(myClass){
            if(!myClass.likes) myClass.likes = []
            myClass.likes.push({student: userId, date: new Date()});
        }

        return Object.assign({...myClass}) as IClass
    }

    /**
     * update is used to update a class
     * @param _class contains the data to push into the existing class
     */
    public async update(_class: IClass):Promise<IClass>{
        const classes = mockDataBase.getDataBase().classes as IClass[];
        const originalClass = classes.find(x => x.id === _class.id);

        if(originalClass){
            originalClass.title = _class.title;
            originalClass.description = _class.description;
            originalClass.updated_at = new Date();
        }

        return Object.assign({...originalClass}) as IClass
    }

    /**
     * delete allows to delete a class by id
     * @param id 
     */
    public async delete(id: string):Promise<void>{
        let classes = mockDataBase.getDataBase().classes as IClass[];
        classes = classes.filter(x => x.id !== id);
        console.log(classes)
    }
}