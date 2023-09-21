import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Authenticate from '@/application/infra/api/authentication';

const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: "yellow"
  }));


export default function LoginPage(){
    const authentication = new Authenticate();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const login =()=>{
        if(username && password){
            authentication.login(username, password)
            .then(response =>{
                if(response.status = 200){
                    console.log(response.data)
                }else{

                }
            })
        }
    }

    return (
        <div style={{ width: "100%", height: "100vh", backgroundColor: "red", display: "flex", justifyContent: 'center', alignItems :"center"}}>
            <div className='bg-white p-7'>
                <div className='bg-slate-200'>
                    <Paper elevation={3} />
                </div>
                <div className=' flex flex-col gap-2'>
                    <h1>Sistema ordem de Serviço</h1>
                    <TextField id="outlined-basic" label="Usuario" value={username} onChange={(e)=>{setUsername(e.target.value)}} variant="outlined" />
                    <TextField id="outlined-basic" label="Senha" value={password} onChange={(e)=>{setPassword(e.target.value)}} type='password' variant="outlined" />
                    <Button variant="contained" color="success" className='bg-slate-500' onClick={login}>Acessar</Button>
                </div>
            </div>
        </div>
    );

}