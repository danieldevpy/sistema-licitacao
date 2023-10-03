import { Request, Response, json } from 'express';
import {SqliteProcess, SqliteDispatch} from '../../sqlite/export';
import { ProcessRequestInsert } from '../../../src/domain/entity/export';
import {
    GetAllProcess,
    CreateProcess,
    CreateProcessAndDispatch,
    UpdateStatusProcess,
    AcceptProcess,
    DispatchProcess
    } from '../../../src/application/usecase/export';


const processRepository = new SqliteProcess();
const dispatchRepository = new SqliteDispatch();

function GetAllProcessController(req: Request, res: Response){
    try{
        const processes = GetAllProcess(processRepository, req.user);
        return res.json(processes);
    }
    catch(error: any){
        res.status(400);
        return res.json({"error": error.message});
    }
};

function GetProcessByIdController(req: Request, res: Response){
 
};

function CreateProcessController(req: Request, res: Response){
    const request: ProcessRequestInsert = req.body;
    try{
        const process = CreateProcess(processRepository, request.number, request.object, request.sector_id);
        res.status(201);
        return res.json(process);
    }
    catch(error: any){
        res.status(400);
        return res.json({"error": error.message});
    }
};

function CreateProcessAndDispatchController(req: Request, res: Response){
    const request: ProcessRequestInsert = req.body;
    try{
        const result = CreateProcessAndDispatch(processRepository, dispatchRepository, req.user, request.number, request.object, request.sector_id);
        res.status(201);
        return res.json(result?.process);
    }
    catch(error: any){
        res.status(400);
        return res.json({"error": error.message});
    }
};

function UpdateStatusProcessController(req: Request, res: Response){
    const id = req.params.id;
    const status = req.params.status;
    const booleanValue = status.toLowerCase() === "true";
    try{
        const process = UpdateStatusProcess(processRepository, Number(id), booleanValue);
        return res.json(process)
    }catch(error: any){
        res.status(400);
        res.json({"error": error.message});
    }
}

function AcceptProcessController(req: Request, res: Response){
    const id_p = req.params.id_p;
    const id_s = req.params.id_s;
    try{
        const process = AcceptProcess(processRepository, dispatchRepository, Number(id_p), Number(id_s), req.user.id);
        return res.json(process)
    }catch(error: any){
        res.status(400);
        res.json({"error": error.message});
    }
}

function DispatchProcessController(req: Request, res: Response){
    const id = req.params.id;
    const {to_sector_id, observation } = req.body;
    const result = DispatchProcess(processRepository, dispatchRepository, Number(id), Number(to_sector_id), observation);
    res.json(result);
}

export {
    GetAllProcessController,
    GetProcessByIdController,
    CreateProcessController,
    CreateProcessAndDispatchController,
    UpdateStatusProcessController,
    DispatchProcessController,
    AcceptProcessController,
    AcceptProcess
};