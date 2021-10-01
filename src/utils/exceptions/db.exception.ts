/**
 * DateBaseException is a class used to manage the database exceptions
 * it responses with a error message
 */
export class DateBaseException extends Error{
    public err: any;
    public code: number;

    constructor(message: string = 'An unexpected error ocurred.', _err: any = {name: 'undefined'}){
        super(message);
        this.err = _err;
        
        if(this.err.name === 'ValidationError') {
            // Some field has a error of format 
            const errors = Object.values(this.err.errors).map((el:any) => el.message);
            const fields = Object.values(this.err.errors).map((el:any) => el.path);
            this.message = `An error ocurred! Check the fields: ${fields}`;
            this.code = 400
        }else if(this.err.code && this.err.code == 11000){
            // Detect repeted unique field 
            this.message = `${this.message} with those fields already exists.`
            this.code = 409
        }else if(this.err.name === 'CastError'){
            this.code = 400
            console.log(this.err.name, this.err)
        }else{
            this.code = 400
        }
    }
}