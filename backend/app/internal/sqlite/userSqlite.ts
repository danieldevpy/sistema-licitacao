import Sqlite from "./sqlite";
import { UserRepository } from "../../src/application/repository/export";
import { User } from "../../src/domain/entity/export";


class SqliteUser implements UserRepository{

    sqlite: Sqlite;
    constructor(){
        this.sqlite = Sqlite.getInstance();
    }

    GetUser(id_user: number): Promise<User> {
        return new Promise((resolve, reject)=>{
            const db = this.sqlite.get_db();
            const query = "SELECT * FROM user WHERE id = ?1;";
            db.get(query, [id_user], (err, row: User)=>{
                if(err){
                    reject(err);
                }else{
                    const user = new User(row.username, row.fullname, row.sector_id,
                        row.password, row.is_staff, row.is_adm, row.id);
                    resolve(user)
                }
            });
        });
    }

    CreateUser(user: User): Promise<number|null> {
       return new Promise((resolve, reject)=>{
        const db = this.sqlite.get_db();
        const query = "INSERT into user (username, fullname, password, sector_id) VALUES (?1, ?2, ?3, ?4) RETURNING id;";
        db.get(query, [user.username, user.fullname, user.password, user.sector_id], (err, row: any)=>{
            if(err){
                return reject(err);
            }
            if(!row){
                return resolve(null);
            }else{
                return resolve(row.id);
            }
        })
       })
  
    }

    CheckAuth(user: string): Promise<{id: number, password: string}> {
        return new Promise((resolve, reject)=>{
            const db = this.sqlite.get_db();
            const query = "SELECT id, password FROM user WHERE username = ?1;";
            db.get(query, [user], (err, row: User)=>{
                if (err) {
                    reject(err);
                } else {
                    if(!row){
                        resolve({id: 0, password: ""});
                        return
                    }
                    const result = {id: row.id, password: row.password};
                    resolve(result);
                }
            });
        });
    }

}

export default SqliteUser;