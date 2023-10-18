import React from "react";
import { User } from "../domain/user";
import { getLocalStorageItem } from "../application/infra/armazenamento/localStorage";
import { getCookie } from "../application/infra/armazenamento/coockie";
import SectorIndex from "../components/single/sectorIndex";

export default function IndexPage(){
    const [user, setUser] = React.useState<User>();

    const renderComponent =(_user: User|undefined)=>{
        if(!user){
            return <label>loading</label>
        }
        const cockie = getCookie('cisbafsession');
        if(!cockie) return to_logout();
        return <SectorIndex user={user} cockie={String(cockie)}/>
    }

    const to_logout =()=>{
        window.location.href = '/login';
    }

    React.useEffect(()=>{
        document.title = 'Controle de Processos CISBAF';
        try{
            const _user = getLocalStorageItem('user');
            if(!_user) throw new Error("not user");
    
            setUser(_user);
        }catch{
            to_logout();
        }
        
    }, [])

    return (
        renderComponent(user)
    );
}