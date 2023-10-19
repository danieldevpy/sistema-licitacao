import React from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Tooltip, CircularProgress, InputBase, IconButton, Paper } from "@mui/material";
import { Sector } from "../../domain/sector";
import Process from "../../domain/process";
import ProcessAPI from "../../application/infra/api/process";
import InputFileUploadComponent from "../reusable/uploadFile";
import Dispatch from "../../domain/dispatch";
import DispatchAPI from "../../application/infra/api/dispatch";
import { SnackInfo, ErrorSnack } from "../reusable/snackBar";
import SaveIcon from '@mui/icons-material/Save';

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
    const [loading, setLoading] = React.useState(false);
    const [colorIcon, setColorIcon] = React.useState<"inherit"|"error">("inherit");

    const preSaveObs = async()=>{
        try{
            if(!textOBS || !textOBS) throw new ErrorSnack("A observação não pode ser vazia", "warning");
            if(colorIcon != "error") throw new ErrorSnack("Não tem alteração para ser salva", "warning");
            const dispatchs = props.dispatchs;
            if(!dispatchs) throw new ErrorSnack("Error COD: DPOBS1", "warning");
            const lastDispatch = dispatchs[dispatchs.length-1];
            lastDispatch.observation = textOBS;
            const response = await api_dispatch.update_observation(lastDispatch);
            if(response.status != 200) throw new ErrorSnack("Não foi possivel realizar a alteração", "error");
            const snack = new SnackInfo(`A observação foi atualizada.`, "success", "bottom", "left");
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
        }finally{
            setColorIcon("inherit");
        }
    }

    const confirmDispatch = async() =>{
        const timer = setTimeout(() => {
            setLoading(true);
        }, 200);
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
        }finally{
            clearTimeout(timer);
            setLoading(false);
        }
    }

    React.useEffect(()=>{
        const dispatchs = props.dispatchs;
        if(!dispatchs) return;
        const lastDispatch = dispatchs[dispatchs.length-1];
        setTextOBS(lastDispatch.observation);
    }, [props.dispatchs])

    return(
        <>
         {loading?(
            <CircularProgress color="success" sx={{alignSelf: "center"}} />
        ):(
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
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    multiline
                    rows={4}
                    value={textOBS}
                    onChange={(e)=>{setTextOBS(e.target.value); setColorIcon("error")}}
                    placeholder="Envie uma observação para o proximo setor!"
                />
                <Tooltip title="Pré salvar a observação">
                <IconButton
                    type="button"
                    sx={{ p: '10px' }}
                    onClick={preSaveObs}
                    >
                    <SaveIcon color={colorIcon} />
                </IconButton>
                </Tooltip>
            </Paper>
            <InputFileUploadComponent
                snackInfo={props.snackInfo}
                snackState={props.snackState}
                onFileSelect={setFile}/>
            <Button
                variant="contained"
                color="success"
                onClick={confirmDispatch}>DESPACHAR PROCESSO</Button> 
        </Box>
        )}
        </>
    );
}