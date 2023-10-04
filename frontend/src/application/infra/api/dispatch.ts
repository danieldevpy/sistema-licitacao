import Dispatch from "@/domain/entity/dispatch";
import { ApiConfig, ResponseAPI } from "./apiconfig";


class DispatchAPI extends ApiConfig{

    get_dispatch(id: number): Promise<ResponseAPI>{
        return new Promise(async(resolve, reject)=>{
            try{
                const result = await this.api_fetch(`${this.url}/dispatch/process/${id}`, "GET");
                resolve(result);
            }catch (error){
                reject(error);
            }
        });
    }

    put_dispatch(dispatch: Dispatch): Promise<ResponseAPI>{
        return new Promise(async(resolve, reject)=>{
            try{
             const result = await this.api_fetch(
                `${this.url}/dispatch/process/${dispatch.id}`,
                "PUT",
                JSON.stringify(dispatch));
             resolve(result);
            }catch (error){
             reject(error);
            }
        });
    }

    upload_pdf(file: File, last_dispatch: number):  Promise<ResponseAPI> {
        return new Promise(async(resolve, reject)=>{
            try{
                const result = await this.api_fetch_no_json(
                    `${this.url}/dispatch/upload/${last_dispatch}`,
                    "POST",
                    file
                )
                resolve(result);
            }catch(error){
                reject(error);
            }
        })
    }
} export default DispatchAPI;