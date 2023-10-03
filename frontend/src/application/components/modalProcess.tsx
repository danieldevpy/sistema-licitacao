import React from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DispatchComponent from './dispatch';
import Button from '@mui/material/Button';
import { Skeleton } from '@mui/material';
import { useTheme } from '@/application/assets/themes/themeContext';
import Process from '@/domain/entity/process';
import Dispatch from '@/domain/entity/dispatch';
import DispatchAPI from '../infra/api/dispatch';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

interface ModalProps{
    title: string;
    open: boolean;
    fclose: any;
    process?: Process;
    dispatchs?: Dispatch[];
    children?: any;
    lastDispatch?: any;
}

export default function ModalProcessComponent(props: ModalProps){
    const { theme, toggleTheme } = useTheme();

    return(
        <Modal
        open={props.open}
        onClose={props.fclose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <div className='modal' style={{backgroundColor: theme.componentBackgroundColor}}>
            <Typography id="modal-modal-title" variant="h6" component="h2" color={theme.textColor} style={{textAlign: "center"}}>
                {props.title}
            </Typography>
            <Typography id="modal-modal-sub-title" variant="h6" component="h3" color={theme.textColor}>
                Processo: {props.process?.number}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}  color={theme.textColor}>
                Objeto: {props.process?.object}
            </Typography>
            <Divider/>
            {props.dispatchs?(
                <div style={{width: "100%", display: "flex", overflowX: "auto", gap: 5, paddingBottom: 15}}>
                {props.dispatchs?.map((dispatch, index)=>(
                    <DispatchComponent key={index} item={dispatch}/>
                ))}
                </div>
            ):(
                <div className='flex flex-col gap-1'>
                    <Skeleton variant="rectangular" width={"100%"} height={20} />
                    <Skeleton variant="rectangular" width={"100%"} height={20} />
                </div>
            )}
  
            <Divider/>
            {props.children}
        </div>
        </Modal>
    )
}