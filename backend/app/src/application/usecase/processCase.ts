import { ProcessRepository, DispatchRepository } from "../repository/export";
import { User, Process, Dispatch} from "../../domain/entity/export";

export function GetAllProcess(repository: ProcessRepository, user: User): Process[]{
    return repository.GetAllProcess(user);
}

export function CreateProcess(
    repository: ProcessRepository,
    number: string,
    object: string,
    sector_id: number
    ): Process {
    return repository.CreateProcess(Process.create(number, object, sector_id));
}

export function CreateProcessAndDispatch(
    processRepository: ProcessRepository,
    dispatchRepository: DispatchRepository,
    user: User,
    number: string,
    object: string,
    sector_id: number
    ): {process: Process, dispatch: Dispatch}|null {
    const process = processRepository.CreateProcess(Process.create(number, object, sector_id));
    if(!process.id){
        return null
    }
    const obs = `Processo n° ${process.number} criado!`;
    const dispatch = dispatchRepository.CreateDispatch(new Dispatch(process.id, user.sector_id, obs, sector_id, user.id, undefined, true));
    return {process: process, dispatch: dispatch}
}

export function UpdateStatusProcess(repository: ProcessRepository, id: number, status: boolean): Process{
    return repository.UpdateStatusProces(id, status);
}

export function AcceptProcess(
    processRepository: ProcessRepository,
    dispatchRepository: DispatchRepository,
    id_process: number,
    id_sector: number,
    id_user: number
    ): {process: Process, dispatch: Dispatch} {
    const process = processRepository.UpdateStatusProces(id_process, true);
    const dispatch = dispatchRepository.CreateDispatchIfAccept(id_process, id_sector, id_user);
    return {process: process, dispatch: dispatch}
}

export function DispatchProcess(
    processRepository: ProcessRepository,
    dispatchRepository: DispatchRepository,
    id: number,
    to_sector_id: number,
    observation: string
): boolean{
    const dispatch = dispatchRepository.GetLastDispatch(id);

    if(dispatch.id){
        dispatchRepository.UpdateSectores(dispatch.id, dispatch.from_sector_id, to_sector_id, observation);
    }
    return processRepository.DispatchProcess(id, to_sector_id);
}