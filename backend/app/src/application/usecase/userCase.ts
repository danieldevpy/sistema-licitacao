import {UserRepository} from "../repository/export";
import {User} from "../../domain/entity/export";

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

    const response = repository.CheckAuth(username);
    if(!response.id) return null;
    const isMatch = await Bun.password.verify(password, response.password);
    if(!isMatch){
        return null;
    }
    return {id: response.id};
}

export {CreateUser, CheckAuth};