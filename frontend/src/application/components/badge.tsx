import React from 'react';
import { useTheme } from '@/application/assets/themes/themeContext';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Process from '@/domain/entity/process';
import ArticleIcon from '@mui/icons-material/Article';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ModalProcessComponent from './modalProcess';
import DispatchAPI from '../infra/api/dispatch';
import Dispatch from '@/domain/entity/dispatch';

interface BadgeProps{
    toolTip: string;
    items: Process[];
    count: number;
    recieve: any;
}

export function BadgeComponent(props: BadgeProps){
    const { theme, toggleTheme } = useTheme();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openModal, setOpenModal] = React.useState(false);
    const [selectedProcess, setSelectedProcess] = React.useState<Process>();
    const [dispatchs, setDispatchs] = React.useState<Dispatch[]>();
    const [showMenu, setShowMenu] = React.useState(false);
    const open = Boolean(anchorEl);
    const api_dispatch = new DispatchAPI();

    React.useEffect(()=>{
        if(selectedProcess){
            api_dispatch.get_dispatch(selectedProcess.id)
            .then(response=>{
                if(response.status == 200){
                    const dispatch:Dispatch[] = response.data;
                    setDispatchs(dispatch);
                }
            })
        }
    }, [selectedProcess])

    React.useEffect(()=>{
        if(props.items.length > 0){
            setShowMenu(true);
        }
    }, [props.items])

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };
    const handleClose = () => {
    setAnchorEl(null);
    };

    const openProcess =(process: Process)=>{
        handleClose();
        setOpenModal(true);
        setSelectedProcess(process);
    }
    const closeModal =()=>{
        setOpenModal(false);
        setSelectedProcess(undefined);
    }

    const recivieProcess =()=>{
        setOpenModal(false);
        props.recieve(selectedProcess);
    }

    return(
        <React.Fragment>
        <Tooltip title={props.toolTip}>
            <a onClick={handleClick}>
            <Badge badgeContent={props.count}  color="warning" style={{cursor: "pointer"}} >
               <ListAltIcon color={theme.icon}/>
            </Badge>
            </a>
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
                bgcolor: theme.componentBackgroundColor,
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                },
            },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
            {showMenu?(
                <List style={{backgroundColor: theme.componentBackgroundColor}}>
                {props.items?.map((process, index) => (
                    <Tooltip key={index+1} title="Recebido a 50 minutos" placement='left'>
                        <Box>
                        <ListItem key={index+2} onClick={()=>{openProcess(process)}} style={{cursor: "pointer"}} >
                            <ListItemIcon key={index+3}>
                                <ArticleIcon color={theme.icon}/>
                            </ListItemIcon>
                            <ListItemText style={{color: theme.textColor}} key={index+4} primary={process.number} secondary={process.object} />
                        </ListItem>
                        <Divider/>
                        </Box>
                    </Tooltip>
                ))}
                </List>
            ):(
                <MenuItem selected={false}>Nenhum Processo</MenuItem>
            )}
            </Menu>
            <ModalProcessComponent title='Receber Processo' open={openModal} fclose={closeModal} process={selectedProcess} dispatchs={dispatchs}>
                 <Button variant="contained" color="success" className='bg-slate-500' onClick={recivieProcess}>RECEBER PROCESSO</Button> 
            </ModalProcessComponent>
        </React.Fragment>
    );
}