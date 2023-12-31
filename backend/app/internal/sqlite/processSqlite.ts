import Sqlite from "./sqlite";
import {ProcessRepository} from "../../src/application/repository/export";
import { User, Process} from "../../src/domain/entity/export";

class SqliteProcess implements ProcessRepository{

    sqlite: Sqlite;
    constructor(){
        this.sqlite = Sqlite.getInstance();
    }

    GetAllProcess(user: User): Promise<Process[]> {
      return new Promise((resolve, reject)=>{
        const db = this.sqlite.get_db();
        var query_string = "";
        var params: any = [];
        if(user.is_staff){
            query_string = `
            SELECT process.id, process_number, object, sector_id, sector.name AS sector, status, active, last_update
            FROM process
            JOIN sector ON process.sector_id = sector.id;
            `
        }else{
            query_string = `
            SELECT process.id, process_number, object, sector_id, sector.name AS sector, status, active, last_update
            FROM process
            JOIN sector ON process.sector_id = sector.id
            WHERE sector_id = ?1;
            `;
            params.push(user.sector_id);
        }
        db.all(query_string, params, (err, rows: any[])=>{
            if(err){
                return reject(err);
            }
            if(!rows){
                return resolve([]);
            }
            const result = rows.map(row=>{
                return new Process(row.id, row.process_number, row.object, row.sector, row.sector_id, row.status, row.active, row.last_update);
            })
            return resolve(result);
        });
      });
        
    }

    CreateProcess(process: Process): Promise<Process> {
       return new Promise((resolve, reject)=>{
            const db = this.sqlite.get_db();
            const query = "INSERT INTO process (process_number, object, sector_id) VALUES (?1, ?2, ?3) RETURNING id, active, last_update;";
            db.get(query, [process.number, process.object, process.sector_id], (err, row: any)=>{
                if(err){
                    return reject(err);
                }
                if(!row){
                    return reject(undefined);
                }
                process.id = row.id;
                process.active = Boolean(row.active);
                process.last_update = row.last_update;
                db.get("SELECT name FROM sector WHERE id = ?1;", [process.sector_id], (err, row: any)=>{
                    if(err){
                        return resolve(process);
                    }
                    process.sector = row.name;
                    resolve(process);
                })
            });
        });
    }

    UpdateStatusProces(id: number, status: boolean): Promise<Process> {
        return new Promise((resolve, reject)=>{
            const db = this.sqlite.get_db();
            const query = "UPDATE process SET status = ?1 WHERE id = ?2 RETURNING process_number, object, sector_id, active";
            db.get(query, [status, id], (err, row:any)=>{
                if(err){
                    return reject(err);
                }
                if(!row){
                    return reject(undefined);
                }
                const process = new Process(id, row.process_number, row.object, "null", row.sector_id, status, row.active, "null");
                db.get('SELECT last_update FROM process WHERE id = ?1', [id], (err, last_row:any)=>{
                    if(err){
                        return resolve(process);
                    }
                    if(!last_row){
                        return resolve(process);
                    }
                    process.last_update = last_row.last_update;
                    return resolve(process);
                })
            });
        });
    }

    DispatchProcess(id: number, to_sector: number): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            const db = this.sqlite.get_db();
            const query = "UPDATE process SET sector_id = ?1, status = ?2 WHERE id =?3;";
            db.run(query, [to_sector, false, id], (err)=>{
                if(err){
                    return reject(err);
                }
                return resolve(true);
            })
        });
    };

}

export default SqliteProcess;
