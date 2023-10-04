

class Process{
    id: number;
    number: string;
    object: string;
    sector: string;
    sector_id: number;
    status: boolean;
    active: boolean;

    constructor(number: string, object: string, sector_id: number, sector?: string, status?: boolean, active?: boolean, id?: number){
        this.id = id||0;
        this.number = number;
        this.object = object;
        this.sector = sector||"null";
        this.sector_id = sector_id;
        this.status = Boolean(status);
        this.active = Boolean(active);
    }

    static create(number: string, object: string, sector_id: number, sector?: string, status?: boolean, active?: boolean, id?: number){
        this.validateNumber(number);
        this.validateObject(object);
        this.validateSector(sector_id);
        return new Process(number, object, sector_id, sector, status, active, id);
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
}



export default Process;