import { IClass, IExtendedClass, IReportClassInteractions } from "./domain/class";

/**
 * This is the contract that all the ClassRepositories have to implement
 */
export interface ClassRepository{

    all():Promise<IClass[]>;
    find(id: string):Promise<IClass>;
    findByModerator(moderatorId: string):Promise<IExtendedClass[]>;
    findByStudent(studentId: string):Promise<IClass[]>;
    checkSchedulableClass(userId: string, type: string, startDate: Date, endDate: Date):Promise<IClass[]>;
    subscribeStudent(classId: string, userId: string):Promise<IClass>;
    addLike(classId: string, userId: string):Promise<IClass>;
    getInteractions(id: string):Promise<IReportClassInteractions| null>;
    store(_class: IClass):Promise<IClass>;
    update(_class: IClass):Promise<IClass>;
    delete(id: string):Promise<void>;
}