import Sqlite from "./sqlite";
import {DispatchRepository} from "../../src/application/repository/export";
import {Dispatch} from "../../src/domain/entity/export";
import moment from "moment";

class SqliteDispatch implements DispatchRepository{

    sqlite: Sqlite;
    constructor(){
        this.sqlite = Sqlite.getInstance();
    }

    CreateDispatch(dispatch: Dispatch): Dispatch {
        const db = this.sqlite.get_db();
        const data = moment().utcOffset('America/Sao_Paulo').format('DD-MM-YYYY HH:mm');
        const query = db.query("INSERT INTO dispatch (process_id, from_sector_id, to_sector_id, user_id, observation, date, status) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)  RETURNING id, status;");
        const row = query.get(dispatch.process_id, dispatch.from_sector_id, dispatch.to_sector_id, dispatch.user_id, dispatch.observation, data, dispatch.status);
        const { id, status } = row as {id: number, status: boolean};
        dispatch.id = id;
        dispatch.status = Boolean(status);
        dispatch.date = data;
        return dispatch;
    };

    CreateDispatchIfAccept(id_process: number, from_sector: number, user_id: number): Dispatch {
        const db = this.sqlite.get_db();
        const date = moment().utcOffset('America/Sao_Paulo').format('DD-MM-YYYY HH:mm');
        const query = db.query("INSERT INTO dispatch (process_id, from_sector_id, user_id, date) VALUES (?1, ?2, ?3, ?4) RETURNING id;");
        const row = query.get(id_process, from_sector, user_id, date);
        const { id } = row as {id: number};
        return new Dispatch(id_process, from_sector, "", undefined, user_id, date, false, undefined, undefined, undefined, undefined, id);
    }

    GetAllDisaptchByIdProcess(id_process: number): Dispatch[] {
        const db = this.sqlite.get_db();
        const query = db.query(`
            SELECT 
            dispatch.id, 
            dispatch.process_id, 
            COALESCE(dispatch.from_sector_id, -1) AS from_sector_id,
            COALESCE(dispatch.to_sector_id, -1) AS to_sector_id,
            dispatch.user_id,
            COALESCE(dispatch.observation, '') AS observation,
            COALESCE(dispatch.date, '') AS date,
            COALESCE(dispatch.status, 0) AS status,
            COALESCE(process.process_number, 'null') AS process,
            COALESCE(from_sector.name, 'null') AS from_sector,
            COALESCE(to_sector.name, 'null') AS to_sector,
            COALESCE(user.fullname, 'null') AS fullname,
            file.id AS fileid
            FROM dispatch
            LEFT JOIN sector AS from_sector ON dispatch.from_sector_id = from_sector.id
            LEFT JOIN sector AS to_sector ON dispatch.to_sector_id = to_sector.id
            LEFT JOIN process ON dispatch.process_id = process.id
            LEFT JOIN user ON dispatch.user_id = user.id
            LEFT JOIN file ON dispatch.id = dispatch_id
            WHERE process_id = ?1;
        `)
        const rows = query.all(id_process);
        return rows.map(row=>{
            const {id, process_id, from_sector_id, to_sector_id, user_id, observation, date, status,
                    process, from_sector, to_sector, fullname, fileid } = row as {
                    id: number, process_id: number, from_sector_id: number, to_sector_id: number,
                    user_id:number, observation: string, date: string, status: boolean, process: string,
                    from_sector: string, to_sector: string, fullname: string, fileid: number
                    }
            return new Dispatch(process_id, from_sector_id, observation, to_sector_id, user_id, date, Boolean(status),
                                process, from_sector, to_sector, fullname, fileid, id);
        })
    };

    GetLastDispatch(id_process: number): Dispatch {
        const db = this.sqlite.get_db();
        const query = db.query(`
            SELECT 
            dispatch.id, 
            dispatch.process_id, 
            COALESCE(dispatch.from_sector_id, -1) AS from_sector_id,
            COALESCE(dispatch.to_sector_id, -1) AS to_sector_id,
            dispatch.user_id,
            COALESCE(dispatch.observation, '') AS observation,
            COALESCE(dispatch.date, '') AS date,
            COALESCE(dispatch.status, 0) AS status,
            COALESCE(process.process_number, 'null') AS process,
            COALESCE(from_sector.name, 'null') AS from_sector,
            COALESCE(to_sector.name, 'null') AS to_sector,
            COALESCE(user.fullname, 'null') AS fullname,
            file.id AS fileid
            FROM dispatch
            LEFT JOIN sector AS from_sector ON dispatch.from_sector_id = from_sector.id
            LEFT JOIN sector AS to_sector ON dispatch.to_sector_id = to_sector.id
            LEFT JOIN process ON dispatch.process_id = process.id
            LEFT JOIN user ON dispatch.user_id = user.id
            LEFT JOIN file ON dispatch.id = dispatch_id
            WHERE process_id = ?1
            ORDER BY dispatch.id DESC
            LIMIT 1;
        `)
        const row = query.get(id_process);
        const {id, process_id, from_sector_id, to_sector_id, user_id, observation, date, status,
            process, from_sector, to_sector, fullname, fileid } = row as {
            id: number, process_id: number, from_sector_id: number, to_sector_id: number,
            user_id:number, observation: string, date: string, status: boolean, process: string,
            from_sector: string, to_sector: string, fullname: string, fileid: number
            }
        return new Dispatch(process_id, from_sector_id, observation, to_sector_id, user_id, date, Boolean(status),
                            process, from_sector, to_sector, fullname, fileid, id);
    }

    UpdateSectores(id : number, from_sector_id: number, to_sector_id: number, observation: string): boolean {
        const db = this.sqlite.get_db();
        const query = db.query("UPDATE dispatch SET from_sector_id = ?1, to_sector_id = ?2, observation = ?3 , status = ?4 WHERE id = ?5;");
        query.run(from_sector_id, to_sector_id, observation, true, id);
        return true
    }
}

export default SqliteDispatch;