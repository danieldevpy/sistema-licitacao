import { ApiConfig, ResponseAPI } from "./apiconfig";


class SectorAPI extends ApiConfig{

    get_sectores(): Promise<ResponseAPI>{
        return new Promise(async(resolve, reject)=>{
            try{
             const result = await this.api_fetch(`${this.url}/sector/`, "GET");
             resolve(result);
            }catch (error){
             reject(error);
            }
        });
    }


} export default SectorAPI;