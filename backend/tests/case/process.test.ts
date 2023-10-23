
import Sqlite from "../../app/internal/sqlite/sqlite";
import { CreateProcess, GetAllProcess, CreateProcessAndDispatch, UpdateStatusProcess, AcceptProcess, GetAllDisaptchByIdProcess, DispatchProcess } from "../../app/src/application/usecase/export";
import {SqliteProcess, SqliteSector, SqliteDispatch} from "../../app/internal/sqlite/export";
import {Sector, User} from "../../app/src/domain/entity/export";



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
        }, 300)
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

test("Criar Processo", async()=>{
    const process = await CreateProcess(processRepository, "5548778332", "Teste", sector_ti.id);
    expect(process.id).toEqual(1);
    expect(process.sector_id).toEqual(sector_ti.id);
    expect(process.status).toEqual(false);
    expect(process.active).toEqual(true);
    expect(process.last_update).toBeDefined();
})

test("Pegar Todos Processos", async()=>{
    const processes = await GetAllProcess(processRepository, user);
    expect(processes.length).toEqual(1);
})

test("Criar Processos e Despachos", async()=>{
    const result = await CreateProcessAndDispatch(
                    processRepository, dispatchRepository, user, "777777",
                    "Novo", sector_ti.id);
    expect(result?.process).toBeDefined();
    expect(result?.dispatch).toBeDefined();
    expect(result?.process.sector_id).toEqual(sector_ti.id);
    expect(result?.process.status).toEqual(false);
    expect(result?.process.active).toEqual(true);
    expect(result?.process.last_update).toBeDefined();
    expect(result?.dispatch.process_id).toEqual(result?.process.id);
    expect(result?.dispatch.from_sector_id).toEqual(sector_recepcao.id);
    expect(result?.dispatch.to_sector_id).toEqual(sector_ti.id);
    expect(result?.dispatch.status).toEqual(true);
})

test("Pegar Todos Processos novamente", async ()=>{
    const processes = await GetAllProcess(processRepository, user);
    expect(processes.length).toEqual(2);
})

test("Aceitar Processo", async()=>{
    const p = (await GetAllProcess(processRepository, user))[1];
    expect(p.id).toBeDefined();
    const result = await AcceptProcess(processRepository, dispatchRepository, p.id, p.sector_id, user.id);
    console.log(p.last_update, result.process.last_update)
    expect(result.process.status).not.toEqual(p.status);
    expect(result.process.last_update).not.toEqual(p.last_update);
    expect(result.process).toBeDefined();
    expect(result.dispatch).toBeDefined();
    expect(result.dispatch.to_sector_id).toEqual(0);
    expect(result.dispatch.status).toEqual(false);

})

test("Update Status Process", async()=>{
    const p = (await GetAllProcess(processRepository, user))[1];
    expect(p.id).toBeDefined();
    const process = await UpdateStatusProcess(processRepository, p.id, false);
    expect(p.status).not.toEqual(process.status);
    const dispatchs = await GetAllDisaptchByIdProcess(dispatchRepository, p.id);
    expect(dispatchs.length).toEqual(2);
})

test('Dispatch Process', async()=>{
    const p = (await GetAllProcess(processRepository, user))[1];
    const obs = "Primeiro despache";
    const result = await DispatchProcess(processRepository, dispatchRepository, p.id, sector_compras.id, obs);
    expect(result).toEqual(true);
    const dispatchs = await GetAllDisaptchByIdProcess(dispatchRepository, p.id);
    expect(dispatchs.length).toEqual(2);
    const dispatch = dispatchs[1];
    expect(dispatch.process_id).toEqual(p.id);
    expect(dispatch.from_sector_id).toEqual(sector_ti.id);
    expect(dispatch.to_sector_id).toEqual(sector_compras.id);
    expect(dispatch.observation).toEqual(obs);
    expect(dispatch.status).toEqual(true);
    expect(dispatch.process).toEqual(p.number);
    expect(dispatch.from_sector).toEqual(sector_ti.name);
    expect(dispatch.to_sector).toEqual(sector_compras.name);
})