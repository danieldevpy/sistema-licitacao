

class Dispatch{
    id: number;
    process_id: number;
    from_sector_id: number;
    to_sector_id: number;
    user_id: number;
    observation: string;
    date: string;
    status: boolean;
    process: string;
    from_sector: string;
    to_sector: string;
    user: string;
    fileid: number;


    constructor(
        process_id: number,
        from_sector_id: number,
        observation: string,
        to_sector_id?: number,
        user_id?: number,
        date?: string,
        status?: boolean,
        process?: string,
        from_sector?: string,
        to_sector?: string,
        user?: string,
        fileid?: number,
        id?: number)
        {
        this.id = id||0;
        this.process_id = process_id;
        this.from_sector_id = from_sector_id;
        this.to_sector_id = to_sector_id||0;
        this.user_id = user_id||0;
        this.observation = observation;
        this.date = date||"null";
        this.status = status||false;
        this.process = process||"null";
        this.from_sector = from_sector||"null";
        this.to_sector = to_sector||"null";
        this.user = user||"null";
        this.fileid = fileid||0;
    }

} export default Dispatch;
