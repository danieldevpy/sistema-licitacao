import React from 'react';
import { setCookie } from '../application/infra/armazenamento/coockie';
import { useNavigate } from "react-router-dom";

export default function LogoutPage(){
    const navigate = useNavigate();

    React.useEffect(()=>{
        setCookie('cisbafsession', '', 1);
        navigate("/login");
    }, [])

    return(
        <></>        
    );
}