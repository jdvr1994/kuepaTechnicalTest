import { ApplicationException } from "../utils/exceptions/application.exception";
import { IClass, IReportClassInteractions, IExtendedClass } from "./repositories/domain/class";
import { ClassRepository } from "./repositories/class.repository";
import {ClassCreateDto, ClassUpdateDto, ClassLikeDto, ClassSubscribeDto} from "../dtos/class.dto"
import { UserRepository } from "./repositories/user.repository";
import { MODERATOR_AUTHORIZATION, STUDENT_AUTHORIZATION } from "../config";

export class ClassService {

    private readonly classRepository: ClassRepository
    private readonly userRepository: UserRepository

    constructor(classRepository: ClassRepository, userRepository: UserRepository){
        this.classRepository = classRepository;
        this.userRepository = userRepository;
        this.all = this.all.bind(this);
        this.find = this.find.bind(this);
        this.store = this.store.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.subscribeToClass = this.subscribeToClass.bind(this);
        this.findByModerator = this.findByModerator.bind(this)
        this.findByStudent = this.findByStudent.bind(this)
    }

    public async all():Promise<IClass[]>{
        return await this.classRepository.all();
    }

    public async find(id: string):Promise<IClass>{
        const _class = await this.classRepository.find(id);
        if(_class) return _class;
        else throw new ApplicationException('This class does not exists.')
    }

    public async findByModerator(moderatorId: string):Promise<IExtendedClass[]>{
        const myClasses = await this.classRepository.findByModerator(moderatorId);
        if(myClasses.length>0) return myClasses;
        else throw new ApplicationException('There is no classes for you.')
    }

    public async findByStudent(studentId: string):Promise<IClass[]>{
        const myClasses = await this.classRepository.findByStudent(studentId);
        if(myClasses.length>0) return myClasses;
        else throw new ApplicationException('There is no classes for you.')
    }

    public async getInteractions(id: string):Promise<IReportClassInteractions>{
        const reportInteractions = await this.classRepository.getInteractions(id);
        if(reportInteractions) return reportInteractions;
        else throw new ApplicationException('This class does not exists.')
    }

    public async store(_class: ClassCreateDto):Promise<IClass>{
        const moderator = await this.userRepository.find(_class.moderator, MODERATOR_AUTHORIZATION);
        if(!moderator) throw new ApplicationException('The moderator does not exist!')

        const _classFound = await this.classRepository.checkSchedulableClass(_class.moderator, MODERATOR_AUTHORIZATION, _class.startDate, _class.endDate);
        if(_classFound.length == 0){
            return await this.classRepository.store(_class as IClass)
        }else{
            throw new ApplicationException('A class already exists with this moderator at this time.')
        }

    }

    
    public async subscribeToClass(classSubscribe: ClassSubscribeDto):Promise<IClass>{
        const student = await this.userRepository.find(classSubscribe.userId, STUDENT_AUTHORIZATION);
        if(!student) throw new ApplicationException('The student does not exist!')

        const myClass =  await this.classRepository.subscribeStudent(classSubscribe.classId, classSubscribe.userId);

        if(myClass) return myClass;
        else throw new ApplicationException('This class does not exists.')

    }

    public async sendLike(classSubscribe: ClassLikeDto):Promise<IClass>{
        const student = await this.userRepository.find(classSubscribe.userId, STUDENT_AUTHORIZATION);
        if(!student) throw new ApplicationException('The student does not exist!')

        const myClass =  await this.classRepository.addLike(classSubscribe.classId, classSubscribe.userId);

        if(myClass) return myClass;
        else throw new ApplicationException('This class does not exists.')

    }

    public async update(_class: ClassUpdateDto):Promise<IClass>{
        const _classFound = await this.classRepository.find(_class.id);
        
        if(_classFound){
            _classFound.id = _class.id? _class.id : _classFound.id;
            _classFound.title = _class.title? _class.title : _classFound.title;
            _classFound.description = _class.description? _class.description : _classFound.description;
            return await this.classRepository.update(_classFound as IClass)
        }else{
            throw new ApplicationException('Class not found.')
        }
    }

    public async delete(id: string):Promise<void>{
        await this.classRepository.delete(id);
    }
}