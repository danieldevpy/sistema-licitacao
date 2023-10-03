import { Request, Response } from 'express';
import {SqliteDispatch, SqliteFile} from '../../sqlite/export';
import { GetAllDisaptchByIdProcess } from '../../../src/application/usecase/export';


const dispatchRepository = new SqliteDispatch();
const fileRepository = new SqliteFile();

function GetAllDisaptchByIdProcessController(req: Request, res: Response){
    const id = req.params.id;
    try{
        const dispatchs = GetAllDisaptchByIdProcess(dispatchRepository, Number(id));
        return res.json(dispatchs);
    }catch(error: any){
        res.status(400);
        return res.json({"error": error.message});
    }
};

async function DispatchUploadController(req: Request, res: Response){
    const id_dispatch = req.params.id_dispatch;
    //@ts-ignore
    const { originalname, mimetype, buffer } = req.file;

    const result = fileRepository.upload(originalname, mimetype, buffer, Number(id_dispatch));
    if(!result){
        return res.json({"error":"Não foi possível realizar o upload do arquivo."});
    }
    res.json({"success":"O arquivo foi enviado."});

}

function DispatchViewPdfController(req: Request, res: Response){
    const id_dispatch = req.params.id_dispatch;
    console.log(id_dispatch);
    const buffer = fileRepository.get_buffer(Number(id_dispatch));
    if(!buffer){
        res.status(400);
        return res.json({"error": "Não foi possível visualizar o arquivo."});
    }
    const fileBuffer = Buffer.from(buffer, 'binary');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=arquivo.pdf`);
    return res.send(fileBuffer);
}

export {GetAllDisaptchByIdProcessController, DispatchUploadController, DispatchViewPdfController};