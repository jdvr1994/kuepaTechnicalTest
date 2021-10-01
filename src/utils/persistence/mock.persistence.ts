import {originalDb} from "./mock.original.persistence";

/**
 * Singleton used to access to mocked database and reset to original values
 */
class MockDataBaseSingleton{
    private static instance: MockDataBaseSingleton;
    private db: any = {};

      /**
     * The MockDataBaseSingleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    public static getInstance(): MockDataBaseSingleton{
        if(this.instance) {
            return this.instance;
        }
        else {
            this.instance = new MockDataBaseSingleton()
            return this.instance
        }
    }

    public getDataBase(): any{ 
        return this.db;
    }

    public initializeMockDataBase(){ 
        this.db = JSON.parse(JSON.stringify(originalDb));
    }

}

export default MockDataBaseSingleton;