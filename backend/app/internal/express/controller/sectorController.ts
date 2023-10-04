import { Request, Response } from 'express';
import {SqliteSector} from '../../sqlite/export';
import {GetAllSector} from '../../../src/application/usecase/export';

const sectorRepository = new SqliteSector();

async function GetAllSectorController(req: Request, res: Response){
    try{
        const sectores = await GetAllSector(sectorRepository);
        return res.json(sectores);
    }catch(error: any){
        res.status(400);
        return res.json({"error": error.message});
    }
};

export {GetAllSectorController};