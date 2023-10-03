import Sqlite from "./sqlite";
import { SectorRepository } from "../../src/application/repository/export";
import { Sector } from "../../src/domain/entity/export";

class SqliteSector implements SectorRepository{

    sqlite: Sqlite;
    constructor(){
        this.sqlite = Sqlite.getInstance();
    }

    GetAllSector(): Sector[] {
        const db = this.sqlite.get_db();
        const query = db.query("SELECT * FROM sector");
        const rows = query.all();
        return rows.map(row => {
            const { id, name } = row as { id: number, name: string };
            return new Sector(name, id);
        });
    }

    CreateSector(name: string): Sector {
        const db = this.sqlite.get_db();
        const query = db.query("INSERT INTO sector (name) VALUES (?1) RETURNING id;")
        const row = query.get(name);    
        const {id} = row as {id: number};
        return new Sector(name, id);
    }
}

export default SqliteSector;