import Sqlite from "./sqlite";
import { UserRepository } from "../../src/application/repository/export";
import { User } from "../../src/domain/entity/export";


class SqliteUser implements UserRepository{

    sqlite: Sqlite;
    constructor(){
        this.sqlite = Sqlite.getInstance();
    }

    GetUser(id_user: number): User {
        const db = this.sqlite.get_db();
        const query = db.query("SELECT * FROM user WHERE id = ?1;")
        const row = query.get(id_user);
        const {id, username, fullname, password, sector_id, is_staff, is_adm} = row as {
            id: number, username: string, fullname:string, password: string, sector_id: number,
            is_staff: boolean, is_adm: boolean
        };
        const user = new User(username, fullname, sector_id, password, is_staff, is_adm, id);
        return user;
    }

    CreateUser(user: User): number|null {
        if(!user.password){
            throw new Error('Insira um numero para o processo.');
        }
        const db = this.sqlite.get_db();
        const query = db.query("INSERT into user (username, fullname, password, sector_id) VALUES (?1, ?2, ?3, ?4) RETURNING id;");
        const row = query.get(user.username, user.fullname, user.password, user.sector_id);
        const { id } = row as {id: number};
        return id;
    }

    CheckAuth(user: string): {id: number, password: string} {
       try{
        const db = this.sqlite.get_db();
        const query = db.query("SELECT id, password FROM user WHERE username = ?1;")
        const row = query.get(user);
        const { id, password } = row as { id: number, password: string};
        return {id: id, password: password};
        }catch(error){
            return {id: 0, password: ""};
        }
    }

}

export default SqliteUser;