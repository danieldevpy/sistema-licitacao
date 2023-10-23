import {DispatchRepository} from "../repository/export";
import {Dispatch} from "../../domain/entity/export";

function CreateDispatch(repository: DispatchRepository, dispatch: Dispatch):  Promise<Dispatch>{
    return repository.CreateDispatch(dispatch);
}

function GetAllDisaptchByIdProcess(repository: DispatchRepository, id_process: number): Promise<Dispatch[]>{
    return repository.GetAllDisaptchByIdProcess(id_process);
}

function UpdateObservation(repository: DispatchRepository, id_dispatch: number, observation: string): Promise<boolean|null>{
    return repository.UpdateObservation(id_dispatch, observation);
}

function GetLastDispatch(repository: DispatchRepository, id_process: number): Promise<Dispatch>{
    return repository.GetLastDispatch(id_process);
}

export {CreateDispatch, GetAllDisaptchByIdProcess, UpdateObservation, GetLastDispatch};