import express from 'express';
import cors from 'cors';
import MiddlewareAuth from './middleware/authMiddleware';
import UploadMiddleware from './middleware/uploadMiddleware';
import {
  CreateUserController,
  GetUserController,
  LoginController,
  GetAllProcessController,
  GetProcessByIdController,
  CreateProcessController,
  CreateProcessAndDispatchController,
  UpdateStatusProcessController,
  DispatchProcessController,
  AcceptProcessController,
  GetAllSectorController,
  GetAllDisaptchByIdProcessController,
  DispatchUploadController,
  DispatchViewPdfController
} from './controller/export';


const app = express();

// middlewares globais
app.use(cors());
app.use(express.json())

// rotas usuários
app.get('/user', MiddlewareAuth.PermissionUser, GetUserController); // pegar o usuário através da authenticação
app.post('/user', CreateUserController); // criar um novo usuário
app.post('/login', LoginController); // realizar o login e devolver o token
// rotas dos processos
app.get('/process', MiddlewareAuth.PermissionUser, GetAllProcessController); // pegar todos processos através do setor do usuário
app.get('/process/status/:id/:status', MiddlewareAuth.PermissionUser, UpdateStatusProcessController); // mudar o status do processo (não está sendo utilizado no frontend)
app.get('/process/accept/:id_p/:id_s', MiddlewareAuth.PermissionUser, AcceptProcessController); // setor aceitar o processo
app.post('/process', MiddlewareAuth.PermissionUser, CreateProcessController); // criação de um novo processo  (não está sendo utilizado no frontend)
app.post('/process/dispatch', MiddlewareAuth.PermissionUser, CreateProcessAndDispatchController); // criação de processo e despacho
app.put('/process/dispatch/:id', MiddlewareAuth.PermissionUser, DispatchProcessController); // dispacho de um processo para o outro  
// rotas dos dispachos
app.get('/dispatch/process/:id', GetAllDisaptchByIdProcessController); //pegar todos dispachos através do id do processo
app.get('/dispatch/pdf/:id_dispatch', DispatchViewPdfController);
app.post('/dispatch/upload/:id_dispatch', UploadMiddleware.PDF, DispatchUploadController);
// rotas dos setores
app.get('/sector', MiddlewareAuth.PermissionUser, GetAllSectorController); // pegar todos os setores registrados no banco


app.listen(3333, () => {
  console.log(`Listening on port ${3333}...`);
});