import Sqlite from "./sqlite";
import {ProcessRepository} from "../../src/application/repository/export";
import { User, Process} from "../../src/domain/entity/export";

class SqliteProcess implements ProcessRepository{

    sqlite: Sqlite;
    constructor(){
        this.sqlite = Sqlite.getInstance();
    }

    GetAllProcess(user: User): Process[] {
        const db = this.sqlite.get_db();
        var query_string = "";
        if(user.is_adm || user.is_staff){
            query_string = `
            SELECT process.id, process_number, object, sector_id, sector.name AS sector, status, active
            FROM process
            JOIN sector ON process.sector_id = sector.id;
            `
        }else{
            query_string = `
            SELECT process.id, process_number, object, sector_id, sector.name AS sector, status, active
            FROM process
            JOIN sector ON process.sector_id = sector.id
            WHERE sector_id = ?1;
            `
        }
        const query = db.query(query_string);
        const rows = query.all(user.sector_id);
        return rows.map(row =>{
            const {id, process_number, object, sector_id, sector, status, active } = row as {
                id: number, process_number: string, object: string, sector_id: number, sector: string, status: boolean, active: boolean };
            return new Process(process_number, object, sector_id, sector, status, active, id);
        });
    }

    CreateProcess(process: Process): Process {
        const db = this.sqlite.get_db();
        const query = db.query("INSERT INTO process (process_number, object, sector_id) VALUES (?1, ?2, ?3) RETURNING id, active;");
        const row = query.get(process.number, process.object, process.sector_id);
        const n_query = db.query("SELECT name FROM sector WHERE id = ?1;");
        const n_row = n_query.get(process.sector_id);
        const {name} = n_row as {name: string};
        const { id, active } = row as {id: number, active: boolean};
        process.id = id;
        process.sector = name;
        process.active = Boolean(active);
        return process;
    }

    UpdateStatusProces(id: number, status: boolean): Process {
        const db = this.sqlite.get_db();
        const query = db.query("UPDATE process SET status = ?1 WHERE id = ?2 RETURNING process_number, object, sector_id, active");
        const row = query.get(status, id);
        const { process_number, object, sector_id, active } = row as {
                process_number: string, object: string, sector_id: number, active: boolean};
        return new Process(process_number, object, sector_id, undefined, status, active, id);
    }

    DispatchProcess(id: number, to_sector: number): boolean {
        const db = this.sqlite.get_db();
        const query = db.query(`
            UPDATE process 
            SET sector_id = ?1, status = ?2 
            WHERE id = ?3;
        `);
        query.run(to_sector, false, id);
        return true;
    }

}

export default SqliteProcess;