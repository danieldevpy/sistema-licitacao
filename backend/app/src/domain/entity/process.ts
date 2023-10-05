import moment from "moment";

class Process{
    id: number;
    number: string;
    object: string;
    sector: string;
    sector_id: number;
    status: boolean;
    active: boolean;
    last_update: string;

    constructor(id: number, number: string, object: string, sector: string, sector_id: number, status: boolean, active: boolean, last_update: string){
        this.id = id;
        this.number = number;
        this.object = object;
        this.sector = sector;
        this.sector_id = sector_id;
        this.status = Boolean(status);
        this.active = Boolean(active);
        this.last_update = last_update;
        this.convert_date();
    }

    static create(number: string, object: string, sector_id: number, sector?: string, status?: boolean, active?: boolean, last_update?: string, id?: number){
        this.validateNumber(number);
        this.validateObject(object);
        this.validateSector(sector_id);
        return new Process(id||0, number, object, sector||"null", sector_id, status||false, active||false, last_update||"null");
    }

    private static validateNumber(number: string){
        if(number == undefined){
                throw new Error('Insira um numero para o processo.');
        }else if (typeof number !== 'string') {
            throw new Error('O número do processo deve ser uma string.');
        }
    }
    
    private static validateObject(object: string){
        if(object == undefined){
            throw new Error('Insira um objeto.');
        }else if (typeof object !== 'string') {
            throw new Error('O objeto deve ser uma string.');
        }else if(object.length < 3){
            throw new Error('O objeto deve conter mais do que 3 caracters.'); 
        }
    }

    private static validateSector(sector_id: number){
        if(sector_id == undefined){
            throw new Error('Insira um setor.');
        }else if (typeof sector_id !== 'number') {
            throw new Error('O setor deve ser um numero');
        }
    }

    private convert_date(){
        if(this.last_update !== "null"){
            try{
                const data = new Date(this.last_update);
                const dataMoment = moment(data);
                const dataFormatada = dataMoment.format('DD-MM-YYYY HH:mm:ss'); 
                this.last_update = dataFormatada;
            }catch{
                return
            }
        }
    }
}



export default Process;