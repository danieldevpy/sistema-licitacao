import React from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DispatchComponent from './dispatch';
import Button from '@mui/material/Button';
import { Skeleton } from '@mui/material';
import { useTheme } from '@/application/assets/themes/themeContext';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Sector } from '@/domain/entity/sector';
import SendIcon from '@mui/icons-material/Send';

interface ModalProps{
    title: string;
    open: boolean;
    fclose: any;
    sectores?: Sector[];
    created?: any;
}

export default function ModalCreateProcessCompoennt(props: ModalProps){
    const { theme, toggleTheme } = useTheme();
    const [numberProcess, setNumberProcess] = React.useState("");
    const [object, setObject] = React.useState("");
    const [selectedSector, setSelectedSector] = React.useState("");

    const created =()=>{
        if(!selectedSector || !numberProcess || !object){
            return
        }
        if(props.created){
            props.created(numberProcess, object, Number(selectedSector))
            setNumberProcess('');
            setObject('');
            setSelectedSector('');
        }
        
    }

    return(
        <Modal
        open={props.open}
        onClose={props.fclose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <div className='modal' style={{backgroundColor: theme.secondComponentBackgroundColor}}>
            <Typography id="modal-modal-title" variant="h6" component="h2" color={theme.textColor} style={{textAlign: "center"}}>
                {props.title}
            </Typography>
            <TextField id="np23" label="Numero do Processo" variant="outlined" sx={{'label': {color: theme.secondTextColor}}} value={numberProcess} onChange={(e)=>{setNumberProcess(e.target.value)}}/>
            <TextField id="np21" label="Objeto" variant="outlined" sx={{'label': {color: theme.secondTextColor}}}  value={object} onChange={(e)=>{setObject(e.target.value)}}/>
            <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Setor</InputLabel>
                    <Select
                        style={{color: theme.secondTextColor}}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedSector}
                        label="Setor"
                        onChange={(e)=>{setSelectedSector(e.target.value)}}
                    >
                        {props.sectores?.map((sector, index)=>(
                            <MenuItem key={index} value={sector.id}>{sector.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={created} className='bg-slate-500' color="success" endIcon={<SendIcon />}>Criar Processo</Button>
        </div>
        </Modal>
    )
}