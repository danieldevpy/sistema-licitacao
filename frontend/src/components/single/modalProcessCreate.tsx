import React from 'react';
import {Modal, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button} from '@mui/material';
import { Sector } from '../../domain/sector';
import SendIcon from '@mui/icons-material/Send';
import ProcessAPI from '../../application/infra/api/process';
import { SnackInfo, ErrorSnack } from '../reusable/snackBar';

interface ModalProps{
    title: string;
    open: boolean;
    modal: any;
    sectores?: Sector[];
    children?: any;
    snackState: any;
    snackInfo: any;
}

export default function ModalProcessCreateComponent(props: ModalProps){
    const processAPI = new ProcessAPI();
    const [numberProcess, setNumberProcess] = React.useState("");
    const [object, setObject] = React.useState("");
    const [selectedSector, setSelectedSector] = React.useState("");

    const createProcess = async()=>{
        try{
            if(!numberProcess || numberProcess == "") throw new ErrorSnack("Preencha o numero do processo!", "warning");
            if(!object || object == "") throw new ErrorSnack("Preencha o objeto do processo!", "warning");
            if(!selectedSector || selectedSector == "") throw new ErrorSnack("Selecione o setor", "warning");
            const response = await processAPI.create_process(numberProcess, object, Number(selectedSector));
            if(response.status != 201) throw new ErrorSnack(response.data.error, "warning");
            setNumberProcess("");
            setObject("");
            setSelectedSector("");
            props.modal(false);
            const snack = new SnackInfo(`Processo ${numberProcess} criado e encaminhado.`, "success", "bottom", "left");
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
        <Modal
        open={props.open}
        onClose={()=>{props.modal(false)}}
        >
        <Box className='modalindex'>
            <Typography
                color="black"
                variant="h6"
                component="h2"
                style={{textAlign: "center"}}>
                {props.title}
            </Typography>
            <TextField
                label="Numero do Processo"
                variant="outlined"
                value={numberProcess}
                onChange={(e)=>{setNumberProcess(e.target.value)}}/>
            <TextField
                label="Objeto"
                variant="outlined"
                value={object}
                onChange={(e)=>{setObject(e.target.value)}}/>
            <FormControl fullWidth>
                <InputLabel>Setor</InputLabel>
                <Select
                    value={selectedSector}
                    label="Setor"
                    onChange={(e)=>{setSelectedSector(e.target.value)}}>
                    {props.sectores?.map((sector, index)=>(
                        <MenuItem key={index} value={sector.id}>{sector.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                variant="contained"
                onClick={createProcess}
                className='bg-slate-500'
                color="success" endIcon={<SendIcon />}>Criar Processo</Button>
        </Box>
        </Modal>
    );
}