import React from "react";
import { setLocalStorageItem } from "../application/infra/armazenamento/localStorage";
import { setCookie, getCookie } from "../application/infra/armazenamento/coockie";
import {Box, Button, TextField, Typography, CircularProgress} from "@mui/material";
import imgLic from '../assets/img/licitacao.png'
import ResponsiveAppBar from "../components/reusable/appBar";
import Authenticate from "../application/infra/api/authentication";
import { SnackBarComponent, SnackInfo, ErrorSnack } from "../components/reusable/snackBar";
import { useNavigate } from "react-router-dom";
import '../assets/css/login.css'


export default function LoginPage(){
    const auth = new Authenticate();
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [snackState, setSnackState] = React.useState(false);
    const [loadingButton, setLoadingButton] = React.useState(false);
    const [snackInfo, setSnackInfo] = React.useState(new SnackInfo());

    const login = async() =>{
        try{
            setLoadingButton(true);
            if(!username || !password) throw new ErrorSnack("Preencha um usuário e uma senha.", "warning")
            const response = await auth.login(username, password);
            if(response.status != 200) throw new ErrorSnack('Usuário ou senha incorretos.', "error");
            setCookie('cisbafsession', JSON.stringify(response.data), auth.expire)
            const coockie = getCookie('cisbafsession')
            if(!coockie) throw new Error('Tente novamente.');
            auth.set_cookie(String(coockie));
            const responseUser = await auth.get_user();
            if(responseUser.status != 200) throw new Error('Tente novamente.');
            setLocalStorageItem('user', responseUser.data);
            navigate("/");
        }catch (error: any) {
            var snack;
            if (error instanceof ErrorSnack) {
                snack = new SnackInfo(error.message, error.type, "bottom", "center");             
            }else{
                snack = new SnackInfo(error.message, "error", "bottom", "center");
            }
            setSnackInfo(snack);
            return setSnackState(true);
        }finally{
            setLoadingButton(false);
        }
    }
    
    React.useEffect(()=>{
        document.title = 'LOGIN - Controle de Processos';
    },[])

    return(
        <Box className="mainlogin">
            <ResponsiveAppBar disableMenu={true} disableAccount={true}/> 
            <Box className="containerlogin">
                <Box className="boxlogologin">
                    <img src={imgLic} className='logologin'/>
                </Box>
                <Box className="formlogin">
                    <Typography 
                        sx={{
                        mr: 2,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.0rem',
                        textDecoration: 'none',
                        color: "black"
                        }}>CONTROLE DE PROCESSOS</Typography>
                                    
                    <TextField className="txtf" label="Usuario" variant="outlined"  value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
                    <TextField label="Senha" type='password' variant="outlined"  value={password} onChange={(e)=>{setPassword(e.target.value)}} />
                    <Button variant="contained" sx={{height: 50}} color="success" className='bg-slate-500' onClick={login} disabled={loadingButton}>
                    {loadingButton? (<CircularProgress size={30} />):("ACESSAR")}
                    </Button>
                    
                </Box>
            </Box>
            <SnackBarComponent state={snackState} setState={setSnackState} info={snackInfo}/>
        </Box>
    );

}