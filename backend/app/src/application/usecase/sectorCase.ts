import {SectorRepository} from "../repository/export";
import {Sector} from "../../domain/entity/export";

function GetAllSector(repository: SectorRepository): Promise<Sector[]>{
    return repository.GetAllSector();
}

export default GetAllSector;