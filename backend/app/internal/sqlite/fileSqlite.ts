import Sqlite from "./sqlite";


class SqliteFile {

    private sqlite: Sqlite;
    constructor(){
        this.sqlite = Sqlite.getInstance();
    }

    upload(originalname: string, mimetype: string, buffer: string, dispatch_id: number): Promise<number|null> {
        return new Promise((resolve, reject)=>{
            const db = this.sqlite.get_db();
            const query = "INSERT INTO file (dispatch_id, filename, mimetype, filedata) VALUES (?1, ?2, ?3, ?4) RETURNING id;";
            db.get(query, [dispatch_id, originalname, mimetype, buffer], (err, row: any)=>{
                if(err){
                    return reject(err);
                }
                if(!row){
                    return resolve(null);
                }
                return resolve(row.id);
            });
        });
    }

    get_buffer(dispatch_id: number): Promise<{[key: string]: string}|null>{
        return new Promise((resolve, reject)=>{
            const db = this.sqlite.get_db();
            const query = "SELECT filename, filedata FROM file WHERE id = ?1";
            db.get(query, [dispatch_id], (err, row: any)=>{
                if(err){
                    return reject(err);
                }
                if(!row){
                    return resolve(null);
                }
                return resolve({fileName: row.filename, fileData: row.filedata});
            });
        });
    }
}

export default SqliteFile;