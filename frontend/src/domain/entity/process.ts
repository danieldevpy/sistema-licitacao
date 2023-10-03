
class Process{
    id: number;
    number: string;
    object: string;
    sector: string;
    sector_id: number;
    status: boolean;
    active: boolean;
    status_name: string;
 
    constructor(id: number, number: string, object: string, sector: string, sector_id: number, status: boolean, active: boolean){
        this.id = id;
        this.number = number;
        this.object = object;
        this.sector = sector;
        this.sector_id = sector_id;
        this.status = status;
        this.active = active;
        if(this.status){
            this.status_name = "Aguardando despache";
        }else{
            this.status_name = "Aguardando setor receber"
        }
    }

    static ConvertToClass(p: Process): Process{
        return new Process(p.id, p.number, p.object, p.sector, p.sector_id, p.status, p.active);
    }
}

export default Process;