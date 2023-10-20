import React from 'react';
import {Modal, Typography, Box, Divider, Skeleton} from '@mui/material';
import DispatchComponent from '../reusable/dispatch';
import Process from '../../domain/process';
import Dispatch from '../../domain/dispatch';
import DispatchAccordion from '../reusable/dispatchAccordion';

interface ModalProps{
    title: string;
    open: boolean;
    fclose: any;
    process?: Process;
    dispatchs?: Dispatch[];
    children?: any;
    lastDispatch?: any;
    isMobile: boolean;
}

export default function ModalProcessComponent(props: ModalProps){
    const scrollableElementRef = React.useRef<HTMLDivElement | null>(null);

    function scrollToFinal() {
        if (scrollableElementRef.current) {
          const scrollableElement = scrollableElementRef.current;
          const scrollWidth = scrollableElement.scrollWidth;
          scrollableElement.scrollLeft = scrollWidth;
        }
    }

    React.useEffect(()=>{
        scrollToFinal();
    })

    return(
        <Modal
        open={props.open}
        onClose={props.fclose}
        >
        <Box className='modalindex'>
            <Typography 
                color="black"
                variant="h6"
                component="h2"
                style={{textAlign: "center"}}>
                {props.title}
            </Typography>
            <Box sx={{display: "flex", gap: 1,  alignItems: "center"}}>
                <Typography
                    color="black"
                    sx={{fontSize: 18}}>Processo:</Typography>
                <Typography
                    color="#4d4d4d">{props.process?.number}</Typography>
            </Box>
            <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                <Typography color="black"sx={{fontSize: 18}}>Objeto:</Typography>
                <Typography color="#4d4d4d">{props.process?.object}</Typography>
            </Box>
            <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                <Typography
                    color="black"
                    sx={{fontSize: 18}} >Status:</Typography>
                <Typography
                    color="#4d4d4d"
                    sx={{maxWidth: "80%"}} >{props.process?.status_name}</Typography>
            </Box>

            <Divider/>
            {props.dispatchs?(
               <>
               {props.isMobile?(

                <DispatchAccordion dispatchs={props.dispatchs}/>
               ):(
                 <Box ref={scrollableElementRef} className="boxdispatchindex">
                 {props.dispatchs?.map((dispatch, index)=>(
                     <DispatchComponent key={index} item={dispatch}/>
                 ))}
                 </Box>
               )}
               </>
            ):(
                <Box className='flex flex-col gap-1'>
                    <Skeleton variant="rectangular" width={"100%"} height={20} />
                    <Skeleton variant="rectangular" width={"100%"} height={20} />
                </Box>
            )}
  
            <Divider/>
            {props.children}
        </Box>
        </Modal>
    )
}