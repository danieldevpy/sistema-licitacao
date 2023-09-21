

export type ResponseAPI = {
    status: number;
    data: any;
}


export class ApiConfig{

    url: string;

    constructor(){
        this.url = "http://localhost:8000"
    }
}




