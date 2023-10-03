import { ApiConfig, ResponseAPI } from "./apiconfig";
import Process from "@/domain/entity/process";

class ProcessAPI extends ApiConfig{

    get_process(): Promise<ResponseAPI>{
        return new Promise(async(resolve, reject)=>{
            try{
             const result = await this.api_fetch(`${this.url}/process`, "GET");
             resolve(result);
            }catch (error){
             reject(error);
            }
        });
    }

    accept_process(process: Process): Promise<ResponseAPI>{
        return new Promise(async(resolve, reject)=>{
            try{
                const result = await this.api_fetch(
                    `${this.url}/process/accept/${process.id}/${process.sector_id}`,
                    "GET"
                )
                resolve(result);
            }catch(error){
                reject(error);
            }
        });
    }

    create_process(n: string, o: string, s: number): Promise<ResponseAPI>{
        return new Promise(async(resolve, reject)=>{
            try{
             const result = await this.api_fetch(
                `${this.url}/process/dispatch`,
                "POST",
                JSON.stringify({
                    "number": n,
                    "object": o,
                    "sector_id": s
                }));
             resolve(result);
            }catch (error){
             reject(error);
            }
        });
    }

    dispatch_process(process: Process, observation: string):  Promise<ResponseAPI>{
        return new Promise(async(resolve, reject)=>{
            try{
                const result = await this.api_fetch(
                    `${this.url}/process/dispatch/${process.id}`,
                    "PUT",
                    JSON.stringify({
                        "to_sector_id": process.sector_id,
                        "observation": observation
                    })
                )
                resolve(result);
            }catch(error){
                reject(error);
            }
        })
    }

} export default ProcessAPI;