import React from "react";
import { setLocalStorageItem } from "../application/infra/armazenamento/localStorage";
import { setCookie, getCookie } from "../application/infra/armazenamento/coockie";
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import imgLic from '../assets/img/licitacao.png'
import { CircularProgress, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import ResponsiveAppBar from "../components/reusable/appBar";
import Authenticate from "../application/infra/api/authentication";
import { SnackBarComponent, SnackInfo, ErrorSnack } from "../components/reusable/snackBar";
import '../assets/css/login.css'


export default function LoginPage(){
    const auth = new Authenticate();
    const [loading, setLoading] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [snackState, setSnackState] = React.useState(false);
    const [snackInfo, setSnackInfo] = React.useState(new SnackInfo());

    const login = async() =>{
        try{
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
            window.location.href = "/"
        }catch (error: any) {
            if (error instanceof ErrorSnack) {
                snackInfo.message = error.message;
                snackInfo.type = error.type;
                setSnackInfo(snackInfo);
                return setSnackState(true);
            }
            console.error('Error desconhecido:', error.message);
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
                    <Button variant="contained" color="success" className='bg-slate-500' onClick={login}  disabled={loading}>
                        {loading? (<CircularProgress />):("ACESSAR")}
                    </Button>
                </Box>
            </Box>
            <SnackBarComponent state={snackState} setState={setSnackState} info={snackInfo}/>
        </Box>
    );

}