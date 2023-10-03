import React from 'react';
import { setCookie, getCookie } from '@/application/infra/armazenamento/coockie';

export default function LogoutPage(){

    React.useEffect(()=>{
        setCookie('cisbafsession', '', 1)
        window.location.href = '/login'
    }, [])

    return(
        <div></div>
    );
}