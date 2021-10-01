import { IUser } from "./user";

export interface IClass{
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date,
    cron: string;
    moderator: string,
    students: string[],
    likes: any[],
    created_at: Date | null;
    updated_at: Date | null;
}

/**
 * Main Interfaces to manage response from DataBase (Class)
 */

export interface IExtendedClass{
    _id: string;
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date,
    moderator: string,
    students: IUser[],
    likes: any[],
    created_at: Date | null;
    updated_at: Date | null;
}

export interface IReportClassInteractions{
    classId: string;
    interactions: any;
}

export interface Like{
    student: string;
    date: Date;
}