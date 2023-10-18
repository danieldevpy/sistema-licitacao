import React from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Sector } from "../../domain/sector";
import Process from "../../domain/process";
import ProcessAPI from "../../application/infra/api/process";
import InputFileUploadComponent from "../reusable/uploadFile";
import Dispatch from "../../domain/dispatch";
import DispatchAPI from "../../application/infra/api/dispatch";
import { SnackInfo, ErrorSnack } from "../reusable/snackBar";

interface DispatchProps{
    process?: Process;
    allProcess?: Process[];
    dispatchs?: Dispatch[];
    sectores?: Sector[];
    commit: any;
    modal: any;
    snackState: any;
    snackInfo: any;
}

export default function DispatchProcessComponent(props: DispatchProps){
    const api_process = new ProcessAPI();
    const api_dispatch = new DispatchAPI();
    const [textOBS, setTextOBS] = React.useState<string>();
    const [sectorSelected, setSectorSelected] = React.useState<string>("");
    const [file, setFile] = React.useState<File>();


    const confirm_dispatch = async() =>{
        try{
            if(!sectorSelected || sectorSelected == "") throw new ErrorSnack("Selecione um setor", "warning");
            if(!textOBS || textOBS == "") throw new ErrorSnack("Envie alguma observação", "warning");
            const process = props.process;
            const processes = props.allProcess;
            const dispatchs = props.dispatchs;
            if(!process || !processes || !dispatchs) throw new ErrorSnack("Error COD: DP1", "error");
            if(file){
                const lastDispatch = dispatchs[dispatchs.length-1];
                const response_upload = await api_dispatch.upload_pdf(file, lastDispatch.id);
                if(response_upload.status != 200) throw new ErrorSnack("Não foi possivel fazer o upload", "error");
            }
            process.sector_id = Number(sectorSelected);
            const result = await api_process.dispatch_process(process, textOBS)
            if(result.status != 200) throw new ErrorSnack("Erro ao despachar", "error");
            const new_processes = processes.filter(p=>p.id != process.id);
            props.commit(new_processes);
            props.modal(false);
            const snack = new SnackInfo(`Processo ${process.number} despachado.`, "success", "bottom", "left");
            props.snackInfo(snack);
            return props.snackState(true);
        }catch (error: any){
            var snack;
            if (error instanceof ErrorSnack) {
                snack = new SnackInfo(error.message, error.type, "bottom", "center");             
            }else{
                snack = new SnackInfo(error.message, "error", "bottom", "center");
            }
            props.snackInfo(snack);
            return props.snackState(true);
        }
    }

    return(
        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
            <FormControl fullWidth>
                <InputLabel>Setor</InputLabel>
                <Select
                    value={sectorSelected}
                    label="Setor"
                    onChange={(e)=>{setSectorSelected((e.target.value))}}>
                    {props.sectores?.map((sector, index)=>(
                        <MenuItem key={index} value={sector.id}>{sector.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Observação"
                multiline
                rows={4}
                placeholder='Envie uma observação para o proximo setor!'
                variant="filled"
                value={textOBS}
                onChange={(e)=>{setTextOBS(e.target.value)}}
                />
            <InputFileUploadComponent onFileSelect={setFile}/>
            <Button
                variant="contained"
                color="success"
                onClick={confirm_dispatch}>DESPACHAR PROCESSO</Button> 
        </Box>
    );
}