
import Process from "../../app/src/domain/entity/process";


test("Execption ao criar o numero do processo com number", ()=>{
    expect(() => {
        //@ts-ignore
        Process.create(5545445, "Novo Process", 1)
      }).toThrow(); // ou toThrowError("Mensagem da exceção esperada")
})

test("Execption ao criar a observação do processo com number", ()=>{
    expect(() => {
        //@ts-ignore
        Process.create("5545445", 5544554, 1)
      }).toThrow(); // ou toThrowError("Mensagem da exceção esperada")
})

test("Execption ao criar a sector id do processo com string", ()=>{
    expect(() => {
        //@ts-ignore
        Process.create("5545445", "5544554", "1");
      }).toThrow(); // ou toThrowError("Mensagem da exceção esperada")
})
