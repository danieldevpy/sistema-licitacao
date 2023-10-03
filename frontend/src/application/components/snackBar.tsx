import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface CProps{
    snack: SnackProps;
    end?: any;
}


interface SnackProps{
    message?: string;
    type: "success"|"error"|"info"|"warning";
    open: boolean;
    position?: "bottom"|"top"
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  
export default function SnackBarComponent(props:CProps) {
  const [open, setOpen] = React.useState(false);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    if(props.end){
      props.end();
    }
  };

  React.useEffect(()=>{
    if(props.snack.open){
      setOpen(props.snack.open);
    }

  }, [props])


  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: props.snack.position||"bottom", horizontal: "center" }} >
        <Alert onClose={handleClose} severity={props.snack.type} sx={{ width: '100%' }}>
        {props.snack.message}
        </Alert>
    </Snackbar>
  );
}