/**
 * ApplicationException is a class used to manage the aplication exceptions
 * it responses with a error message
 */
export class ApplicationException extends Error{
    constructor(message: string = 'An unexpected error ocurred.'){
        super(message);
    }
}