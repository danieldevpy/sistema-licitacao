
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Process from '../../domain/process';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Button } from '@mui/material';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

interface ListProps{
    processes?: Process[];
    dClick: any;
}

export default function InteractiveList(props: ListProps) {

    const selected =(process: Process)=>{
        props.dClick({row: process});
    }

  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
   
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Demo>
            {props.processes?.length?(
            <List>
            {props.processes.map(process=>(
                <Button onDoubleClick={()=>{selected(process)}} key={process.id+"btn"} style={{width: "100%"}}>
                  <ListItem  key={process.id+"lst"}>
                    <ListItemAvatar key={process.id+5}>
                    <Avatar key={process.id+7}>
                        <AssignmentIcon key={process.id+8}/>
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                    sx={{color: "black"}}
                    primary={`Processo ${process.number}`}
                    secondary={process.status_name}
                    key={process.id+66}
                    />
                </ListItem>
                </Button>
            ))}
               </List>
            ):(
                <List>
                    <ListItem>
                        <ListItemText sx={{color: "black"}} primary="Nenhum processo para despachar"/>
                    </ListItem>
                </List>
            )}
          </Demo>
        </Grid>
      </Grid>
    </Box>
  );
}