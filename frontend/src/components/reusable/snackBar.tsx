
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert'


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


interface SnackProps{
    state: boolean;
    setState: any;
    info: SnackInfo;
}

  
export function SnackBarComponent(props: SnackProps){

    if(!props.state){
      return
    }
     
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway' || event?.timeStamp == 101010) {
        return;
      }
      props.setState(false);
    };

    return(
        <Snackbar
          anchorOrigin={{vertical: props.info.vertical, horizontal: props.info.horizontal }}
          open={props.state}
          autoHideDuration={6000}
          onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.info.type} sx={{ width: '100%' }}>
          {props.info.message}
        </Alert>
      </Snackbar>
    );
}

export class SnackInfo{
    message: string;
    type: "error"|"warning"|"info"|"success";
    vertical: "top"|"bottom";
    horizontal: "left"|"right"|"center";
    constructor(
      message?: string,
      type?: "error"|"warning"|"info"|"success",
      vertical?: "top"|"bottom",
      horizontal?: "left"|"right"|"center"
      ){
      this.message = message||"init";
      this.type = type||"warning";
      this.vertical = vertical||"top";
      this.horizontal = horizontal||"center";
    }
}

export class ErrorSnack extends Error {
  type: "error"|"warning"|"info"|"success";

  constructor(mensagem: string, type: "error"|"warning"|"info"|"success") {
    super(mensagem);
    this.type = type;
  }
}
