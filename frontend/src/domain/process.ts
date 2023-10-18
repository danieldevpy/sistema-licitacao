import moment from "moment";
import 'moment/locale/pt-br'; // Importe o idioma para português

moment.suppressDeprecationWarnings = true;
moment.locale('pt-br');

class Process{
    id: number;
    number: string;
    object: string;
    sector: string;
    sector_id: number;
    status: boolean;
    active: boolean;
    status_name: string;
    last_update: string;
 
    constructor(id: number, number: string, object: string, sector: string, sector_id: number, status: boolean, active: boolean, last_update: string){
        this.id = id;
        this.number = number;
        this.object = object;
        this.sector = sector;
        this.sector_id = sector_id;
        this.status = status;
        this.active = active;
        this.status_name = "";
        this.last_update = last_update;
        this.set_configs();
    }

    private async set_configs(){
        if(this.status_name == "" && this.last_update){
            const data1 = moment(this.last_update, 'DD-MM-YYYY HH:mm:ss');  // Certifique-se de que this.last_update está no formato 'DD-MM-YYYY HH:mm:ss'
            const data2 = moment(moment().format('DD-MM-YYYY HH:mm:ss'), 'DD-MM-YYYY HH:mm:ss');
            const diferencaFormatada = moment.duration(data2.diff(data1)).humanize();
            this.last_update = diferencaFormatada;
        }
        if(this.status){
            this.status_name = `O processo está no setor ${this.sector} há (${this.last_update}) `;
        }else{
            this.status_name = `Aguardando recebimento pelo setor ${this.sector} há (${this.last_update})`
        }
    }

    static ConvertToClass(p: Process): Process{
        return new Process(p.id, p.number, p.object, p.sector, p.sector_id, p.status, p.active, p.last_update);
    }
}

export default Process;