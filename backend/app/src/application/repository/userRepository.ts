import {User} from "../../domain/entity/export"

export default interface UserRepository {
    GetUser(id_user: number): User;
    CreateUser(user: User): number|null;
    CheckAuth(user: string): {id: number, password: string};
}