import {Process, User} from "../../domain/entity/export";


export default interface ProcessRepository {
    GetAllProcess(user: User): Process[];
    CreateProcess(process: Process): Process;
    UpdateStatusProces(id: number, status: boolean): Process;
    DispatchProcess(id: number, to_sector: number): boolean;
}

