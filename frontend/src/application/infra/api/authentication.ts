import { ApiConfig, ResponseAPI } from "./apiconfig";



class Authenticate extends ApiConfig{

    login(username: string, password: string): Promise<ResponseAPI>{
        return new Promise(async(resolve, reject)=>{
            try{
                const json_string = JSON.stringify({"username": username, "password": password});
                const result = await this.api_fetch(`${this.url}/login/`, "POST", json_string);
                resolve(result);
            }catch (error){
                reject(error);
            }
        });
    }

    get_user(): Promise<ResponseAPI>{
        return new Promise(async(resolve, reject)=>{
           try{
            const result = await this.api_fetch(`${this.url}/user`, "GET");
            resolve(result);
           }catch (error){
            reject(error);
           }
        });
    }
} export default Authenticate;