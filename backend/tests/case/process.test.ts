import { expect, test } from "bun:test";
import Sqlite from "../../app/internal/sqlite/sqlite";
import { CreateProcess, GetAllProcess, CreateProcessAndDispatch, UpdateStatusProcess, AcceptProcess, GetAllDisaptchByIdProcess, DispatchProcess } from "../../app/src/application/usecase/export";
import {SqliteProcess, SqliteSector, SqliteDispatch} from "../../app/internal/sqlite/export";
import {User} from "../../app/src/domain/entity/export";

Sqlite.getInstance(":memory:")

const processRepository = new SqliteProcess();
const sectorRepository = new SqliteSector();
const dispatchRepository = new SqliteDispatch();

const sector_recepcao = sectorRepository.CreateSector("Recepcao");
const sector_ti = sectorRepository.CreateSector("TI");
const sector_compras = sectorRepository.CreateSector("Compras")
const user = new User("Test", "Full name", sector_recepcao.id, "undefined", true, undefined, 1)

test("Criar Processo", ()=>{
    const process = CreateProcess(processRepository, "5548778332", "Teste", sector_ti.id);
    expect(process.id).toEqual(1);
    expect(process.sector_id).toEqual(sector_ti.id);
    expect(process.status).toEqual(false);
    expect(process.active).toEqual(true);
})

test("Pegar Todos Processos", async()=>{
    const processes = GetAllProcess(processRepository, user);
    expect(processes.length).toEqual(1);
})

test("Criar Processos e Despachos", ()=>{
    const result = CreateProcessAndDispatch(
                    processRepository, dispatchRepository, user, "777777",
                    "Novo", sector_ti.id);
    expect(result?.process).toBeDefined();
    expect(result?.dispatch).toBeDefined();
    expect(result?.process.sector_id).toEqual(sector_ti.id);
    expect(result?.process.status).toEqual(false);
    expect(result?.process.active).toEqual(true);
    expect(result?.dispatch.process_id).toEqual(result?.process.id);
    expect(result?.dispatch.from_sector_id).toEqual(sector_recepcao.id);
    expect(result?.dispatch.to_sector_id).toEqual(sector_ti.id);
    expect(result?.dispatch.status).toEqual(true);
})

test("Pegar Todos Processos novamente", ()=>{
    const processes = GetAllProcess(processRepository, user);
    expect(processes.length).toEqual(2);
})

test("Aceitar Processo", ()=>{
    const p = GetAllProcess(processRepository, user)[1];
    expect(p.id).toBeDefined();
    const result = AcceptProcess(processRepository, dispatchRepository, p.id, p.sector_id, user.id);
    expect(p.status).not.toEqual(result.process.status);
    expect(result.process).toBeDefined();
    expect(result.dispatch).toBeDefined();
    expect(result.dispatch.to_sector_id).toEqual(0);
    expect(result.dispatch.status).toEqual(false);
})

test("Update Status Process", ()=>{
    const p = GetAllProcess(processRepository, user)[1];
    expect(p.id).toBeDefined();
    const process = UpdateStatusProcess(processRepository, p.id, false);
    expect(p.status).not.toEqual(process.status);
    const dispatchs = GetAllDisaptchByIdProcess(dispatchRepository, p.id);
    expect(dispatchs.length).toEqual(2);
})

test('Dispatch Process', ()=>{
    const p = GetAllProcess(processRepository, user)[1];
    const obs = "Primeiro despache";
    const result = DispatchProcess(processRepository, dispatchRepository, p.id, sector_compras.id, obs);
    expect(result).toEqual(true);
    const dispatchs = GetAllDisaptchByIdProcess(dispatchRepository, p.id);
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