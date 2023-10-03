import { GetAllSectorController } from "./sectorController";
import {CreateUserController, LoginController, GetUserController} from "./userController";
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
    GetUserController,
    CreateUserController,
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
