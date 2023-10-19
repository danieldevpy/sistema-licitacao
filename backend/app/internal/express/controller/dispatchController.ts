import { Request, Response } from 'express';
import {SqliteDispatch, SqliteFile} from '../../sqlite/export';
import { GetAllDisaptchByIdProcess, UpdateObservation } from '../../../src/application/usecase/export';


const dispatchRepository = new SqliteDispatch();
const fileRepository = new SqliteFile();

async function GetAllDisaptchByIdProcessController(req: Request, res: Response){
    const id = req.params.id;
    try{
        const dispatchs = await GetAllDisaptchByIdProcess(dispatchRepository, Number(id));
        return res.json(dispatchs);
    }catch(error: any){
        res.status(400);
        return res.json({"error": error.message});
    }
};

async function DispatchUploadController(req: Request, res: Response){
    const id_dispatch = req.params.id_dispatch;
    // @ts-ignore
    const { originalname, mimetype, buffer } = req.file;
    const result = await fileRepository.upload(originalname, mimetype, buffer, Number(id_dispatch));
    if(!result){
        return res.status(500).json({ error: 'Ocorreu um erro ao processar o upload.' });
    }
    res.json({"success":"O arquivo foi enviado."});

}

async function DispatchViewPdfController(req: Request, res: Response){
    const id_dispatch = req.params.id_dispatch;
    const buffer = await fileRepository.get_buffer(Number(id_dispatch));
    if(!buffer){
        res.status(400);
        return res.json({"error": "Não foi possível visualizar o arquivo."});
    }
    const fileBuffer = Buffer.from(buffer.fileData, 'binary');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${buffer.fileName}`);
    return res.send(fileBuffer);
}

async function DispatchUpdateObsController(req: Request, res: Response){
    const id_dispatch = req.params.id_dispatch;
    const { observation } = req.body;
    if(!observation){
        res.status(400);
        return res.json({"error": "Não localizar a observação"});
    }
    const response = await UpdateObservation(dispatchRepository, Number(id_dispatch), observation);
    if(!response){
        res.status(400);
        return res.json({"error": "Não localizar a observação"});
    }
    return res.json(response);
}

export {
    GetAllDisaptchByIdProcessController,
    DispatchUploadController,
    DispatchViewPdfController,
    DispatchUpdateObsController
};