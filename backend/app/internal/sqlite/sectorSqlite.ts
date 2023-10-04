import Sqlite from "./sqlite";
import { SectorRepository } from "../../src/application/repository/export";
import { Sector } from "../../src/domain/entity/export";



class SqliteSector implements SectorRepository{

    sqlite: Sqlite;
    constructor(){
        this.sqlite = Sqlite.getInstance();
    }

    GetAllSector(): Promise<Sector[]> {
        return new Promise((resolve, reject) => {
            const db = this.sqlite.get_db();
            db.all("SELECT * FROM sector", (err: any, rows: Sector[]) => {
                if (err) {
                    reject(err);
                } else {
                    const sectors = rows.map(row => new Sector(row.name, row.id));
                    resolve(sectors);
                }
            });
        });
    }

    CreateSector(name: string): Promise<Sector> {
        return new Promise((resolve, reject) => {
            const db = this.sqlite.get_db();
            const query = db.prepare("INSERT INTO sector (name) VALUES (?)");
            query.run(name, function (err: any) {
                if (err) {
                    reject(err);
                } else {
                    const id = this.lastID;
                    const sector = new Sector(name, id);
                    resolve(sector);
                }
            });
        });
    }
}

export default SqliteSector;