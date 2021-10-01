import { IUser } from "../../domain/user";
import { UserRepository } from "../../user.repository";
import MockDataBaseSingleton from "../../../../utils/persistence/mock.persistence"

const mockDataBase = MockDataBaseSingleton.getInstance();

export class UserMockRepository implements UserRepository{

    public async all(type: string):Promise<IUser[]>{
        const users = mockDataBase.getDataBase().users as IUser[];
        return Object.assign([...users]) as IUser[]
    }

    public async find(id: string, type: string):Promise<IUser | null>{
        const users = mockDataBase.getDataBase().users as IUser[];
        const user = users.find(x => x.id === id);
        return user as IUser
    }

    public async login(userName:string, password:string, type: string):Promise<IUser | null> {

        const users = mockDataBase.getDataBase().users as IUser[];
        const user = users.find(x => x.userName === userName && x.type === type);

        if(user){
            user.login_at.push( new Date());
        }

        if(user) return Object.assign({...user}) as IUser
        else return null;
    }

    public async findByUser(userName: string): Promise<IUser | null> {
        const users = mockDataBase.getDataBase().users as IUser[];
        const user = users.find(x => x.userName === userName);
        if(user) return Object.assign({...user}) as IUser
        else return null;
    }

    public async store(user: IUser):Promise<IUser>{
        const users = mockDataBase.getDataBase().users as any;
        user.created_at = new Date();
        user.id = "elusuariotieneId"+ Math.random()*100;
        
        users.push({
            id: user.id,
            type: user.type,
            names: user.names,
            lastNames: user.lastNames,
            userName: user.userName,
            password: user.password,
            created_at: new Date(),
            updated_at: null,
            login_at: [new Date()]
        } as IUser);

        return user as IUser
    }

    public async update(user: IUser):Promise<IUser>{
        const users = mockDataBase.getDataBase().users as IUser[];
        const originalUser = users.find(x => x.id === user.id);

        if(originalUser){
            originalUser.names = user.names;
            originalUser.lastNames = user.lastNames;
            originalUser.phone = user.phone;
            originalUser.updated_at = new Date();
        }

        return Object.assign({...originalUser}) as IUser
    }

    public async delete(id: string):Promise<void>{
        let users = mockDataBase.getDataBase().users as IUser[];
        users = users.filter(x => x.id !== id);
        console.log(users)
    }
}