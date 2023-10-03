import User from "./user"
import Process from "./process"
import Sector from "./sector"
import Dispatch from "./dispatch"


type ProcessRequestInsert = {
    number: string;
    object: string;
    sector_id: number;
}

type SectorRequest = {
    name: string;
}

type UserRequest = {
    username: string;
    fullname: string;
    password: string;
    sector_id: number;
}

export {
    User,
    UserRequest,
    Process,
    ProcessRequestInsert,
    Sector,
    SectorRequest,
    Dispatch,
};