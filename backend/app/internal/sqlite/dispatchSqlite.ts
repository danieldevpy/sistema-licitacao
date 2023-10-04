import Sqlite from "./sqlite";
import {DispatchRepository} from "../../src/application/repository/export";
import {Dispatch} from "../../src/domain/entity/export";
import moment from "moment";

class SqliteDispatch implements DispatchRepository{

    sqlite: Sqlite;
    constructor(){
        this.sqlite = Sqlite.getInstance();
    }

    CreateDispatch(dispatch: Dispatch): Promise<Dispatch> {
        return new Promise((resolve, reject)=>{
            const db = this.sqlite.get_db();
            const data = moment().utcOffset('America/Sao_Paulo').format('DD-MM-YYYY HH:mm');
            const query = "INSERT INTO dispatch (process_id, from_sector_id, to_sector_id, user_id, observation, date, status) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)  RETURNING id, status;";
            db.get(query, [dispatch.process_id, dispatch.from_sector_id, dispatch.to_sector_id, dispatch.user_id, dispatch.observation, data, dispatch.status], (err, row: any)=>{
                if(err){
                    return reject(err);
                }
                if(!row){
                    return reject(undefined);
                }
                dispatch.id = row.id;
                dispatch.status = Boolean(row.status);
                dispatch.date = data;
                return resolve(dispatch);
            });
        });
    };

    CreateDispatchIfAccept(id_process: number, from_sector: number, user_id: number): Promise<Dispatch> {
        return new Promise((resolve, reject)=>{
            const db = this.sqlite.get_db();
            const date = moment().utcOffset('America/Sao_Paulo').format('DD-MM-YYYY HH:mm');
            const query = "INSERT INTO dispatch (process_id, from_sector_id, user_id, date) VALUES (?1, ?2, ?3, ?4) RETURNING id;";
            db.get(query, [id_process, from_sector, user_id, date], (err, row: any)=>{
                if(err){
                    return reject(err);
                }
                if(!row){
                    return reject(undefined);
                }
                const dispatch = new Dispatch(id_process, from_sector, "", undefined, user_id, date, false, undefined, undefined, undefined, undefined, row.id);
                return resolve(dispatch);
            });
        });
    }

    GetAllDisaptchByIdProcess(id_process: number): Promise<Dispatch[]>{
        return new Promise((resolve, reject)=>{
            const db = this.sqlite.get_db();
            const query = `
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
            `;
            db.all(query, [id_process], (err, rows:any)=>{
               if(err){
                return reject(err);
               } 
               if(!rows){
                return reject(undefined);
               }
               const dispatchs = rows.map((row:any)=>{
                return new Dispatch(row.process_id, row.from_sector_id, row.observation, row.to_sector_id, row.user_id, row.date, Boolean(row.status),
                    row.process, row.from_sector, row.to_sector, row.fullname, row.fileid, row.id);
               })
               return resolve(dispatchs);
            });
        });
    }

    GetLastDispatch(id_process: number): Promise<Dispatch> {
        return new Promise((resolve, reject)=>{
            const db = this.sqlite.get_db();
            const query = `
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
            `;
            db.get(query, [id_process], (err, row:any)=>{
                if(err){
                 return reject(err);
                } 
                if(!row){
                 return reject(undefined);
                }
                const dispatch = new Dispatch(row.process_id, row.from_sector_id, row.observation, row.to_sector_id, row.user_id, row.date, Boolean(row.status),
                    row.process, row.from_sector, row.to_sector, row.fullname, row.fileid, row.id);
                return resolve(dispatch);
             });
        });
    }

    UpdateSectores(id : number, from_sector_id: number, to_sector_id: number, observation: string): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            const db = this.sqlite.get_db();
            const query = "UPDATE dispatch SET from_sector_id = ?1, to_sector_id = ?2, observation = ?3 , status = ?4 WHERE id = ?5;";
            db.run(query, [from_sector_id, to_sector_id, observation, true, id], (err)=>{
                if(err){
                    return reject(err);
                }
                return resolve(true);
            });
        });
    }
}

export default SqliteDispatch;