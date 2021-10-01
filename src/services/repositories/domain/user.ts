/**
 * Main Interface to manage response from DataBase (User)
 */
export interface IUser{
    id: string;
    type: string;
    names: string;
    lastNames: string;
    userName: string;
    password: string;
    phone: string;
    created_at: Date | null;
    updated_at: Date | null;
    login_at: Date[];
}