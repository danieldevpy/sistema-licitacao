import { Request, Response } from 'express';
import {UserRequest} from '../../../src/domain/entity/export';
import {SqliteUser} from '../../sqlite/export';
import {CheckAuth, CreateUser} from '../../../src/application/usecase/export';
import MiddlewareAuth from '../middleware/authMiddleware';

const userRepository = new SqliteUser();

function GetUserController(req: Request, res: Response){
    return res.json(req.user);
}

async function CreateUserController(req: Request, res: Response){
    const userRequest: UserRequest = req.body;
    try{
        const id = await CreateUser(userRepository, userRequest.username, userRequest.fullname, userRequest.password, userRequest.sector_id);
        console.log(id);
        res.status(201);
        return res.json({"sucess": `o id do usuário criado é ${id}`});
    }catch(error: any){
        res.status(404);
        return res.json({"error": error.message});
    }
};

async function LoginController(req: Request, res: Response){
    const {username, password} = req.body;
    if(!username || !password){
        return
    }
    const result = await CheckAuth(userRepository, username, password);
    if(result){
        const token = MiddlewareAuth.setToken(result.id);
        return res.json({"access": token});
    }
    res.status(400);
    res.json({"error": "falha na authenticação"});
}

export {CreateUserController, GetUserController, LoginController};