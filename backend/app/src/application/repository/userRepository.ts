import {User} from "../../domain/entity/export"

export default interface UserRepository {
    GetUser(id_user: number): Promise<User>;
    CreateUser(user: User): Promise<number|null>;
    CheckAuth(user: string): Promise<{id: number, password: string}>;
}