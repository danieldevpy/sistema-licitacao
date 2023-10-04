import { GetAllSectorController } from "./sectorController";
import { LoginController, GetUserController, CreateUserController} from "./userController";
import { GetAllDisaptchByIdProcessController, DispatchUploadController, DispatchViewPdfController } from "./dispatchController";
import {
    GetAllProcessController,
    GetProcessByIdController,
    CreateProcessController,
    CreateProcessAndDispatchController,
    UpdateStatusProcessController,
    DispatchProcessController,
    AcceptProcessController
} from "../controller/processController";

export {
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
}
