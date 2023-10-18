type Dispatch = {
    id: number;
    process_id: number;
    from_sector_id: number;
    to_sector_id?: number;
    user_id: number;
    observation: string;
    date?: string;
    status: boolean;
    process?: string;
    from_sector?: string;
    to_sector?: string;
    user: string;
    fileid?: number;
}


export default Dispatch;