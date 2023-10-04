import bcrypt from 'bcrypt';

class User{

    id: number;
    username: string;
    fullname: string;
    sector_id: number;
    password: string;
    is_staff: boolean;
    is_adm: boolean;

    constructor(username: string, fullname: string, sector_id: number, password: string, is_staff?: boolean, is_adm?: boolean, id?: number){
        this.id = id||0;
        this.username = username;
        this.fullname = fullname;
        this.sector_id = sector_id;
        this.password = password;
        this.is_staff = Boolean(is_staff);
        this.is_adm = Boolean(is_adm);
    }

    static async create(username: string, fullname: string, sector_id: number, password: string, is_staff?: boolean, is_adm?: boolean){
        this.validateUsername(username);
        this.validateFullname(fullname);
        this.validatePassword(password);
        this.validateSectorID(sector_id);
        const saltRounds = 10;
        const hash_password = await bcrypt.hash(password, saltRounds);
        return new User(username, fullname, sector_id, hash_password, is_staff, is_adm);
    }

    private static validateUsername(username: string){
        if(username == undefined){
            throw new Error('Insira o nome do usuário.');
        }
    }

    private static validateFullname(fullname: string){
        if(fullname == undefined){
            throw new Error('Insira o nome completo.');
        }
    }

    private static validatePassword(password: string){
        if(password == undefined){
            throw new Error('Insira a senha.');
        }
        if(password.length < 6 || password.length > 15){
            throw new Error('A senha deve conter entre 6 a 15 caracters.');
        }
    }

    private static validateSectorID(sector_id: number){
        if(sector_id == undefined){
            throw new Error('Insira o id do setor.');
        }
    }


} export default User;