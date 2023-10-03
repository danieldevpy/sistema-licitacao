import Sqlite from "./sqlite";


class SqliteFile {

    private sqlite: Sqlite;
    constructor(){
        this.sqlite = Sqlite.getInstance();
    }

    upload(originalname: string, mimetype: string, buffer: string, dispatch_id: number): number|null{
        const db = this.sqlite.get_db();
        const query = db.query(`
            INSERT INTO file (dispatch_id, filename, mimetype, filedata) VALUES (?1, ?2, ?3, ?4) RETURNING id;
        `);
        try{
            const row = query.get(dispatch_id, originalname, mimetype, buffer);
            const {id} = row as {id: number};
            return id;
        }catch(error:any){
            return null;
        }
    }

    get_buffer(dispatch_id: number): string|null{
        const db = this.sqlite.get_db();
        try{
            const query = db.query("SELECT filedata FROM file WHERE id = ?1");
            const row = query.get(dispatch_id);
            const { filedata } = row as {filedata: string};
            return filedata;
        }catch{
            return null;
        }

    }
}

export default SqliteFile;