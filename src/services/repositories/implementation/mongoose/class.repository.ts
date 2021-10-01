import ClassModel from "../../../../models/class.model";
import { IClass, IReportClassInteractions, IExtendedClass, Like } from "../../domain/class";
import { ClassRepository } from "../../class.repository";
import { isValidObjectId } from "mongoose";
import { DateBaseException } from "../../../../utils/exceptions/db.exception";
import { MODERATOR_AUTHORIZATION, STUDENT_AUTHORIZATION } from "../../../../config";

/**
 * ClassMongooseRepository is the repository to manage of direct way the communication with the MongoDB database (mongoose)
 * ClassRepository is the contract signed by all the Repositories (for Class)
 */
export class ClassMongooseRepository implements ClassRepository{
    
    /**
     * all - used to get all classes from database
     */
    public async all():Promise<IClass[]>{
        const classes = await ClassModel.find().select("-likes");
        return classes as IClass[]
    }

    /**
     * find - used to get a class by Id from database
     */
    public async find(id: string):Promise<IClass>{
        if(!isValidObjectId(id)) throw new DateBaseException('The object structure is wrong!')
        const _class = await ClassModel.findOne({_id : id}).select("-likes").lean()
        return _class as IClass
    }

    /**
     * findByModerator - used to get a class by moderatorId from database
     * @param moderatorId is the id of moderator
     */
    public async findByModerator(moderatorId: string):Promise<IExtendedClass[]>{
        if(!isValidObjectId(moderatorId)) throw new DateBaseException('The object structure is wrong!')

        var populateQuery = [{path:'students', select:'_id names lastNames userName'}];
        const classes = await ClassModel.find({moderator: moderatorId}).select("-moderator -likes").populate(populateQuery).lean();
        const classesWithId = classes.map((aClass: any)=>{
            aClass.id = aClass._id;
            return aClass;
        })

        return classesWithId as IExtendedClass[]
    }

    /**
     * findByStudent - used to get a class by @studentId from database
     * @param studentId 
     */
    public async findByStudent(studentId: string):Promise<IClass[]>{
        if(!isValidObjectId(studentId)) throw new DateBaseException('The object structure is wrong!')

        const classes = await ClassModel.find({students: studentId}).select("-likes").lean();
        const classesWithId = classes.map((aClass: any)=>{
            aClass.id = aClass._id;
            return aClass;
        })

        return classesWithId as IClass[]
    }

    /**
     * checkSchedulableClass allows to check if the time range is available to schedule a new class
     * @param userId : id of the user that it want to know if it is available
     * @param type : type of the user (moderator, student)
     * @param startDate: start time for the class
     * @param endDate:  end time for the class
     */
    public async checkSchedulableClass(userId: string, type: string, startDate: Date, endDate: Date): Promise<IClass[]> {
        if(!isValidObjectId(userId)) throw new DateBaseException('The object structure is wrong!')
        try{

            let searchParams: any = {
                startDate: { $gte: startDate , $lt: endDate},
                endDate: { $gt: startDate , $lte: endDate},
            }

            if(type === MODERATOR_AUTHORIZATION) searchParams.moderator = userId;
            if(type === STUDENT_AUTHORIZATION) searchParams.students = userId;

            const _classes = await ClassModel.find(searchParams).lean()

            return _classes as IClass[]
        }catch(err){
            throw new DateBaseException('Class',err);
        }
    }

    /**
     * getInteractions is used to get a report of the student interaction for a specifically class
     * @param id: id of the class for analysis
     */
    public async getInteractions(id: string): Promise<IReportClassInteractions | null> {
        if(!isValidObjectId(id)) throw new DateBaseException('The object structure is wrong!')

        var populateQuery = [{path:'likes.student', select:'_id names lastNames userName'}];
        const _class = await ClassModel.findOne({_id : id}).populate(populateQuery).lean()
        
        if(_class){
            const reportClassInteractions: IReportClassInteractions = {} as IReportClassInteractions;
            
            const reducer = (contadorLikes: any = {}, like: any) => {
                contadorLikes[like.student.userName] = (contadorLikes[like.student.userName] || 0) + 1;
                return contadorLikes;
            }

            reportClassInteractions.classId = _class._id;
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
        if(!isValidObjectId(_class.id)) throw new DateBaseException('The object structure is wrong!')
        if(!isValidObjectId(_class.moderator)) throw new DateBaseException('The moderatorId structure is wrong!')

        _class.created_at = new Date();
        
        try{
            const newClass = new ClassModel(_class)
            const classStored = await newClass.save()
            const classStoredLean = classStored.toObject()
            return classStoredLean as IClass
        }catch(err){
            throw new DateBaseException('Class',err);
        }
    }

    /**
     * subscribeStudent allows to subscribe a student to a class
     * @param classId: id of the class
     * @param userId: id of the student
     */
    public async subscribeStudent(classId: string, userId:string):Promise<IClass> {
        const myClass = await ClassModel.findOneAndUpdate(

                {_id : classId}, // searching params
                {$addToSet: 
                    {"students" : {_id: userId}} //add student without duplicates
                },
                {new: true}

        ).lean()

        if(myClass) myClass.id = myClass._id;
        return myClass as IClass;
    }

    /**
     * addLike allows to add a new like to a class
     * @param classId: id of the class
     * @param userId: id of the student
     */
    public async addLike(classId: string, userId:string):Promise<IClass> {
        const myClass = await ClassModel.findOneAndUpdate(

                {_id : classId}, // searching params
                {$addToSet: 
                    {"likes" : {student: userId, date: new Date()}} //add student without duplicates
                },
                {new: true}

        ).lean()

        if(myClass) myClass.id = myClass._id;
        return myClass as IClass;
    }

    /**
     * update is used to update a class
     * @param _class contains the data to push into the existing class
     */
    public async update(_class: IClass):Promise<IClass>{
        _class.updated_at = new Date();
        const classUpdated = await ClassModel.findByIdAndUpdate(_class.id,_class,{new: true}).lean()
        return classUpdated as IClass
    }

    /**
     * delete allows to delete a class by id
     * @param id 
     */
    public async delete(id: string):Promise<void>{
        const _class = await ClassModel.findOneAndDelete({_id: id})
        console.log(_class)
    }
}