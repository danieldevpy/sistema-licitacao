import Sqlite from "../../app/internal/sqlite/sqlite";
import { CreateDispatch, GetAllDisaptchByIdProcess, GetLastDispatch, UpdateObservation } from "../../app/src/application/usecase/export";
import {SqliteProcess, SqliteSector, SqliteDispatch} from "../../app/internal/sqlite/export";
import {Dispatch, Sector, User} from "../../app/src/domain/entity/export";



var processRepository: SqliteProcess;
var sectorRepository : SqliteSector;
var dispatchRepository: SqliteDispatch;

var sector_recepcao: Sector;
var sector_ti: Sector;
var sector_compras: Sector;
var user: User;


async function time(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('');
        }, 1000)
    })
}


beforeAll(async() => {
    Sqlite.getInstance(":memory:")
    processRepository = new SqliteProcess();
    sectorRepository = new SqliteSector();
    dispatchRepository = new SqliteDispatch();
    await time();
    sector_recepcao = await sectorRepository.CreateSector("Recepcao");
    sector_ti = await sectorRepository.CreateSector("TI");
    sector_compras = await sectorRepository.CreateSector("Compras");
    user = new User("Test", "Full name", sector_recepcao.id, "undefined", true, undefined, 1);
  });


test("Create Dispatch", async()=>{
    const dispatch = new Dispatch(1, 1, "Primeira Criação");
    const dispatchCreated = await CreateDispatch(dispatchRepository, dispatch);
    expect(dispatchCreated.id).toEqual(1);
    expect(dispatchCreated.process_id).toEqual(1);
    expect(dispatchCreated.from_sector_id).toEqual(1);
    expect(dispatchCreated.observation).toEqual('Primeira Criação')    
})

test("Get all Dispatch by id Process", async()=>{
    const allDispatchs = await GetAllDisaptchByIdProcess(dispatchRepository, 1);
    expect(allDispatchs.length).toEqual(1);
})

test('Get Last Dispatch by ID process', async()=>{
    const lastDispatch = await GetLastDispatch(dispatchRepository, 1);
    expect(lastDispatch.id).toEqual(1)
    expect(lastDispatch.process_id).toEqual(1);
    expect(lastDispatch.from_sector_id).toEqual(1);
    expect(lastDispatch.observation).toEqual('Primeira Criação')    
})

test('Update Observation', async()=>{
    const lastDispatchAfter = await GetLastDispatch(dispatchRepository, 1);
    const result = UpdateObservation(dispatchRepository, lastDispatchAfter.id, "Changed");
    if(!result) throw new Error("Não foi possivel alterar")
    const lastDispatchBefore = await GetLastDispatch(dispatchRepository, 1);
    expect(lastDispatchAfter.observation).not.toEqual(lastDispatchBefore.observation)
})