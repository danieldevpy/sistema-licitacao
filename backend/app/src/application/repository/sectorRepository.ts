import {Sector} from "../../domain/entity/export";

export default interface SectorRepository {
    GetAllSector(): Sector[];
    CreateSector(name: string): Sector;
}