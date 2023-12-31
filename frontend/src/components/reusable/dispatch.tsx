import React from "react"
import Dispatch from "../../domain/dispatch";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box  from "@mui/material/Box";
import { ApiConfig } from "../../application/infra/api/apiconfig";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';


interface DispatchProps{
    item: Dispatch;
}

export default function DispatchComponent(props: DispatchProps){

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const api = new ApiConfig();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const generate_label =()=>{
        if(props.item.status){
            return `${props.item.from_sector} > ${props.item.to_sector}`
        }
        return props.item.from_sector
    }
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return(
        <div>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Button aria-describedby={id} color={props.item.status? "success":"error"} variant="outlined" onClick={handleClick} sx={{height: 70, width: 250, padding: 1, fontSize: 12,}}>
                {generate_label()}
                </Button>
                <div className="arrow" style={{borderLeftColor: props.item.status? "#a6ffbc":"#ffa6a6"}}></div>
            </Box>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                >
                <Box sx={{padding: 2, maxWidth: 400, }}>
                    <Typography sx={{fontSize: 12, textAlign: "end"}}>{`~ ${props.item.user}`}</Typography>
                    <Typography  sx={{lineBreak: "anywhere"}}>{props.item.observation}</Typography>
                    {props.item.fileid? (
                        <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                            <Typography sx={{fontSize: 12}} color="red">PDF anexado {">"} </Typography>
                            <a href={`${api.url}/dispatch/pdf/${props.item.fileid}`} target="_blank">
                                <PictureAsPdfIcon color="error"/>
                            </a>
                        </Box>
                    ):(null)}
        
                    {props.item.status? (
                        <Typography color="#878787">{`Enviado no dia ${props.item.date}`}</Typography>
                    ):(
                        <Typography color="#878787" sx={{fontSize: 14}}>{`Processo aceito no dia ${props.item.date}. Aguardando o despache!`}</Typography>
                    )}
    
                </Box>
            </Popover>
        </div>
    );
}