import {Process, User} from "../../domain/entity/export";


export default interface ProcessRepository {
    GetAllProcess(user: User): Promise<Process[]>;
    CreateProcess(process: Process): Promise<Process>;
    UpdateStatusProces(id: number, status: boolean): Promise<Process>;
    DispatchProcess(id: number, to_sector: number): Promise<boolean>;
}

