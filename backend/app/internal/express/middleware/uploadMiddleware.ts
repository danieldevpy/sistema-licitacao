import { Request, Response, NextFunction } from 'express';
import multer, { Multer } from 'multer';


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,  // Exemplo: 10MB
  },
 });

class UploadMiddleware{

    static PDF(req: Request, res: Response, next: NextFunction){
        upload.single('pdf')(req, res, err =>{
            if (err instanceof multer.MulterError) {
                // Erros específicos do Multer
                return res.status(400).json({ error: err.message });
              } else if (err) {
                // Outros erros
                return res.status(500).json({ error: 'Ocorreu um erro ao processar o upload.' });
              }
              next();
        })
    }
} export default UploadMiddleware;