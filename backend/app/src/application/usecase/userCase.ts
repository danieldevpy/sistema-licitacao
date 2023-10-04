import {UserRepository} from "../repository/export";
import {User} from "../../domain/entity/export";
import bcrypt from 'bcrypt';

async function CreateUser(
    repository: UserRepository,
    username: string,
    fullname: string,
    password: string,
    sector_id: number
    ):  Promise<number|null>
    {

    const user = await User.create(username, fullname, sector_id, password);
    return repository.CreateUser(user);
}

async function CheckAuth(
    repository: UserRepository,
    username: string,
    password: string
):  Promise<{ id: number; } | null> {

    const response = await repository.CheckAuth(username);
    if(!response.id || response.id == 0) return null;
    const isMatch = await bcrypt.compare(password, response.password);
    if(!isMatch){
        return null;
    }
    return {id: response.id};
}

export {CreateUser, CheckAuth};