import {
    GetAllProcess,
    CreateProcess,
    CreateProcessAndDispatch,
    UpdateStatusProcess,
    AcceptProcess,
    DispatchProcess } from "./processCase";
import GetAllSector from "./sectorCase";
import { CheckAuth, CreateUser} from "./userCase";
import {
    CreateDispatch,
    GetAllDisaptchByIdProcess,
    UpdateObservation,
    GetLastDispatch} from "./dispatchCase";

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
    CreateDispatch,
    GetAllDisaptchByIdProcess,
    UpdateObservation,
    GetLastDispatch
    }