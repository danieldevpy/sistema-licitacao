import { ApiConfig, ResponseAPI } from "./default";



class Authenticate extends ApiConfig{


    login(username: string, password: string): Promise<ResponseAPI>{
        return new Promise(async(resolve, reject)=>{
            try{
                const json_string = JSON.stringify({"username": username, "password": password});
                console.log(`${this.url}/api/token/`)
                const response = await fetch(`${this.url}/api/token/`, {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: json_string
                });
                const data =  await response.json();
                const result: ResponseAPI = {status: response.status, data: data};
                resolve(result);
            }catch (error){
                reject(error);
            }
        })
    }
} export default Authenticate;