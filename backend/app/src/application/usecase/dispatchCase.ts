import {DispatchRepository} from "../repository/export";
import {Dispatch} from "../../domain/entity/export";


function GetAllDisaptchByIdProcess(repository: DispatchRepository, id: number): Promise<Dispatch[]>{
    return repository.GetAllDisaptchByIdProcess(id);
}

function UpdateObservation(repository: DispatchRepository, id_dispatch: number, observation: string): Promise<boolean|null>{
    return repository.UpdateObservation(id_dispatch, observation);
}

export {GetAllDisaptchByIdProcess, UpdateObservation};