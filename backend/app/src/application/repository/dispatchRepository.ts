import {Dispatch} from "../../domain/entity/export";


export default interface DispatchRepository{
    CreateDispatch(dispatch: Dispatch): Promise<Dispatch>;
    CreateDispatchIfAccept(id_process: number, from_sector: number, user_id: number): Promise<Dispatch>;
    GetAllDisaptchByIdProcess(id_process: number): Promise<Dispatch[]>;
    GetLastDispatch(id_process: number): Promise<Dispatch> ;
    UpdateSectores(id: number, from_sector_id: number, to_sector_id: number, observation: string): Promise<boolean>;
}