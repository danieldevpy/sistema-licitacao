import { Request, Response } from 'express';
import {SqliteDispatch, SqliteFile} from '../../sqlite/export';
import { GetAllDisaptchByIdProcess } from '../../../src/application/usecase/export';


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
    console.log(result);
    res.json({"success":"O arquivo foi enviado."});

}

async function DispatchViewPdfController(req: Request, res: Response){
    const id_dispatch = req.params.id_dispatch;

    const buffer = await fileRepository.get_buffer(Number(id_dispatch));
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