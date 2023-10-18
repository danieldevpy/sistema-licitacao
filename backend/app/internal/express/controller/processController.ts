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

async function GetAllProcessController(req: Request, res: Response){
    try{
        const processes = await GetAllProcess(processRepository, req.user);
        return res.json(processes);
    }
    catch(error: any){
        res.status(400);
        return res.json({"error": error.message});
    }
};

function GetProcessByIdController(req: Request, res: Response){
 
};

async function CreateProcessController(req: Request, res: Response){
    const request: ProcessRequestInsert = req.body;
    try{
        const process = await CreateProcess(processRepository, request.number, request.object, request.sector_id);
        res.status(201);
        return res.json(process);
    }
    catch(error: any){
        res.status(400);
        return res.json({"error": error.message});
    }
};

async function CreateProcessAndDispatchController(req: Request, res: Response){
    const request: ProcessRequestInsert = req.body;
    try{
        const result = await CreateProcessAndDispatch(processRepository, dispatchRepository, req.user, request.number, request.object, request.sector_id);
        res.status(201);
        return res.json(result?.process);
    }
    catch(error: any){
        res.status(400);
        return res.json({"error": error.message});
    }
};

async function UpdateStatusProcessController(req: Request, res: Response){
    const id = req.params.id;
    const status = req.params.status;
    const booleanValue = status.toLowerCase() === "true";
    try{
        const process = await UpdateStatusProcess(processRepository, Number(id), booleanValue);
        return res.json(process)
    }catch(error: any){
        res.status(400);
        res.json({"error": error.message});
    }
}

async function AcceptProcessController(req: Request, res: Response){
    const id_p = req.params.id_p;
    const id_s = req.params.id_s;
    try{
        const process = await AcceptProcess(processRepository, dispatchRepository, Number(id_p), Number(id_s), req.user.id);
        return res.json(process)
    }catch(error: any){
        console.log(error);
        res.status(400);
        res.json({"error": error});
    }
}

async function DispatchProcessController(req: Request, res: Response){
    const id = req.params.id;
    const {to_sector_id, observation } = req.body;
    const result = await DispatchProcess(processRepository, dispatchRepository, Number(id), Number(to_sector_id), observation);
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