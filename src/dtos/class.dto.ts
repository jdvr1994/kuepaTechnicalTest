/**
 * DTO to create a new class 
 */
interface ClassCreateDto {
    id: string,
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    moderator: string;
}

/**
 * DTO to update a class 
 */
interface ClassUpdateDto {
    id: string,
    title: string;
    description: string;
}

/**
 * DTO to subscribe a student to a class 
 */
interface ClassSubscribeDto {
    classId: string;
    userId: string;
}

/**
 * DTO to store a like (by student) to a class 
 */
interface ClassLikeDto {
    classId: string;
    userId: string;
}

export {ClassCreateDto, ClassUpdateDto, ClassSubscribeDto, ClassLikeDto}