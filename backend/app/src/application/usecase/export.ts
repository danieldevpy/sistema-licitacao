import {
    GetAllProcess,
    CreateProcess,
    CreateProcessAndDispatch,
    UpdateStatusProcess,
    AcceptProcess,
    DispatchProcess } from "./processCase";
import GetAllSector from "./sectorCase";
import { CheckAuth, CreateUser} from "./userCase";
import { GetAllDisaptchByIdProcess, UpdateObservation } from "./dispatchCase";

export {
    CreateUser,
    CheckAuth,
    GetAllProcess,
    CreateProcess,
    GetAllSector,
    CreateProcessAndDispatch,
    UpdateStatusProcess,
    AcceptProcess,
    DispatchProcess,
    GetAllDisaptchByIdProcess,
    UpdateObservation
    }