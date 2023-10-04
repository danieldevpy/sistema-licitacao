import {DispatchRepository} from "../repository/export";
import {Dispatch} from "../../domain/entity/export";


function GetAllDisaptchByIdProcess(repository: DispatchRepository, id: number): Promise<Dispatch[]>{
    return repository.GetAllDisaptchByIdProcess(id);
}

export {GetAllDisaptchByIdProcess};