import React from "react"
import Dispatch from "@/domain/entity/dispatch"
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box  from "@mui/material/Box";
import { useTheme } from '@/application/assets/themes/themeContext';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { ApiConfig } from "../infra/api/apiconfig";

interface DispatchProps{
    item: Dispatch;
}

export default function DispatchComponent(props: DispatchProps){
    const { theme, toggleTheme } = useTheme();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const api = new ApiConfig();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return(
            <div>
                <Button aria-describedby={id} color={props.item.status? "success": "error"} variant="outlined" onClick={handleClick} sx={{width: "100%", height: 70, minWidth: 250, padding: 1}}>
                {`${props.item.from_sector} > ${props.item.to_sector}`}
                 </Button>
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
                    <Box sx={{padding: 2, maxWidth: 300}}>
                        <Typography color="grey" sx={{fontSize: 12, textAlign: "end"}}>{`~ ${props.item.user}`}</Typography>
                        <Typography>{props.item.observation}</Typography>
                        {props.item.fileid? (
                            <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                                <Typography sx={{fontSize: 12}} color="red">PDF anexado {">"} </Typography>
                                <a href={`${api.url}/dispatch/pdf/${props.item.fileid}`} target="_blank">
                                    <PictureAsPdfIcon color="error"/>
                                </a>
                            </Box>
                        ):(null)}
         
                        {props.item.status? (
                            <Typography color="grey">{`Enviado no dia ${props.item.date}`}</Typography>
                        ):(
                            <Typography color="grey">{`O setor ainda não despachou o processo.`}</Typography>
                        )}
     
                    </Box>
                </Popover>
            </div>

    );
}