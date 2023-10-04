import {Sector} from "../../domain/entity/export";

export default interface SectorRepository {
    GetAllSector(): Promise<Sector[]>;
    CreateSector(name: string): Promise<Sector>;
}