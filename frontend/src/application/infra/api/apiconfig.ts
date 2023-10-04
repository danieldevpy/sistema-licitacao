

export type ResponseAPI = {
    status: number;
    data: any;
}

interface CustomHeaders {
    'Content-Type': string;
    'Authorization': any;
  }

export class ApiConfig{

    url: string;
    static token?: string;
    expire: number;

    constructor(){
        this.url = "http://localhost:3333";
        this.expire = 1296000000;
    }

    set_cookie(token: string) {
        const tk = JSON.parse(token);
        if (tk.access) {
            ApiConfig.token = tk.access;
        }
    }

    async api_fetch(url: string, method: string, body?: any){
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': ApiConfig.token
        }
        const response = await fetch(url, {
            method: method,
            headers: this.convertToHeaders(headers),
            body: body,
        });
        const data =  await response.json();
        const result: ResponseAPI = {status: response.status, data: data};
        return result;
    }

    async api_fetch_no_json(url: string, method: string, file: File){
        const formData = new FormData();
        formData.append('pdf', file);
        const response = await fetch(url,  {
            method: 'POST',
            body: formData
          })
        const data = await response.json();
        const result: ResponseAPI = {status: response.status, data: data};
        return result;
    }


    convertToHeaders(headers: CustomHeaders): Record<string, string> {
        const convertedHeaders: Record<string, string> = {};
        for (const [key, value] of Object.entries(headers)) {
          convertedHeaders[key] = value;
        }
        return convertedHeaders;
      }
      
}




