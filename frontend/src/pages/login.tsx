import React from 'react';
import { setLocalStorageItem, getLocalStorageItem } from '@/application/infra/armazenamento/localStorage';
import { setCookie, getCookie } from '@/application/infra/armazenamento/coockie';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Authenticate from '@/application/infra/api/authentication';
import imgLic from '../application/assets/img/licitacao.png'
import { CircularProgress } from '@mui/material';
import SnackBarComponent from '@/application/components/snackBar';


interface SnackProps{
    message?: string;
    type: "success"|"error"|"info"|"warning";
    open: boolean;
    position?: "top"|"bottom";
}

export default function LoginPage(){
    const authentication = new Authenticate();
    const router = useRouter();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [snackBarProps, setSnackBarProps] = React.useState<SnackProps>({type: 'info', open: false});
    

    React.useEffect(()=>{
        const coockie = getCookie('cisbafsession');
        if(coockie){
            router.push('/');
        }else{
            setVisible(true);
        }
    }, [])


    const login =()=>{
        if(username && password){
            setLoading(true);
            authentication.login(username, password)
            .then(async(response) =>{
                if(response.status == 200){
                    setCookie('cisbafsession', JSON.stringify(response.data), authentication.expire)
                    const coockie = getCookie('cisbafsession')
                    if(coockie){
                        authentication.set_cookie(String(coockie));
                        let response = await authentication.get_user()
                        if(response.status == 200){
                            setLocalStorageItem('user', response.data);
                            window.location.href = "/";
                        }
                    }
                }else{
                    setSnackBarProps({type: "error", message: "Usuário ou senha incorretos!", open: true, position: "top"})
                }
            })
            .catch((error)=>{
                setSnackBarProps({type: "error", message: error.message, open: true})
            })
            .finally(()=>{
                setLoading(false);
            })
        }
    }

    return (
        <div className='boxlogin' style={{backgroundColor: "#F5F5F5"}}>
            {visible? (
                <div className='bg-white p-7'>
                <div>
                    <img src={imgLic.src} className='logo'/>
                </div>
                <div className=' flex flex-col gap-2'>
                    <h1>Sistema de Licitação CISBAF</h1>
                    <TextField id="outlined-basic" label="Usuario" value={username} onChange={(e)=>{setUsername(e.target.value)}} variant="outlined" />
                    <TextField id="outlined-basic" label="Senha" value={password} onChange={(e)=>{setPassword(e.target.value)}} type='password' variant="outlined" />
                    <Button variant="contained" color="success" className='bg-slate-500' onClick={login} disabled={loading}>
                        {loading? (<CircularProgress />):("ACESSAR")}
                    </Button>
                </div>
            </div>
            ):(null)}
            <SnackBarComponent snack={snackBarProps}/>
        </div>
    );

}