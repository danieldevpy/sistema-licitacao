import { Badge, Box, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import ListAltIcon from '@mui/icons-material/ListAlt';
import ArticleIcon from '@mui/icons-material/Article';
import React from "react";
import Process from "../../domain/process";
import ProcessAPI from "../../application/infra/api/process";
import { SnackInfo, ErrorSnack } from "../reusable/snackBar";

interface BadgeProps{
    sector_user: number;
    setSelected: any;
    modal: any;
    extesion: any;
    commit: any;
    processes?: Process[];
    snackState: any;
    snackInfo: any;
}

export default function BadgeProcessComponent(props: BadgeProps){
    const [badge, setBadge] = React.useState<Process[]>();
    const [showMenu, setShowMenu] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const api = new ProcessAPI();
    
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const acceptProcess = async(process: Process)=>{
        try{
            process.status = true;
            const response = await api.accept_process(process)
            if(response.status != 200) throw new ErrorSnack("Error COD: AP1", "error");
            const processes = props.processes;
            if(!processes) throw new ErrorSnack("Error COD: AP2", "error");
            const new_processes = processes.filter(p=>p.id != process.id);
            new_processes.push(process);
            props.extesion(undefined);
            props.commit(new_processes);
            props.modal(false);
            props.setSelected(undefined);
            const snack = new SnackInfo(`Processo ${process.number} recebido.`, "success", "bottom", "left");
            props.snackInfo(snack);
            return props.snackState(true);
        }catch (error: any){
            if (error instanceof ErrorSnack) {
                const snack = new SnackInfo(error.message, error.type, "bottom", "center");
                props.snackInfo(snack);
                return props.snackState(true);
            }
            console.error('Error desconhecido:', error.message);
        }
    }

    const openProcess = (process: Process) =>{
        props.setSelected({process: process, editable: false})
        props.modal(true);
        props.extesion(
            <Button
            variant="contained"
            color="success"
            onClick={()=>{acceptProcess(process)}}>Receber Processo</Button> 
        )
    }

    React.useEffect(()=>{
        if(badge && badge.length > 0){
            return setShowMenu(true);
        }
        return setShowMenu(false);
    }, [badge])

    React.useEffect(()=>{
        if(props.processes && props.processes.length > 0){
            const processes = props.processes.filter(p=>p.status == false && p.sector_id == props.sector_user);
            setBadge(processes);
        }
    }, [props.processes])

    return(
        <React.Fragment>
        <Tooltip title={"Processos Pendentes"} onClick={handleClick}>
            <Badge badgeContent={badge?.length}  color="warning" style={{cursor: "pointer"}} >
               <ListAltIcon/>
            </Badge>
        </Tooltip>
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
            elevation: 0,
            sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
                },
                '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "white",
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                },
            },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
            {showMenu?(
                <List>
                {badge?.map((process, index) => (
                    <Tooltip key={index+1} title='Clique para visualizar o processo' placement='left'>
                        <Box>
                        <ListItem key={index+2} onClick={()=>{openProcess(process)}} style={{cursor: "pointer"}} >
                            <ListItemIcon key={index+3} >
                                <ArticleIcon sx={{fontSize: 40}}/>
                            </ListItemIcon>
                            <ListItemText style={{color: "black"}} key={index+4} primary={process.number} secondary={process.object} />
                        </ListItem>
                        <Divider/>
                        </Box>
                    </Tooltip>
                ))}
                </List>
            ):(
                <MenuItem  selected={false}>Nenhum Processo</MenuItem>
            )}
            </Menu>
        </React.Fragment>
    );
}