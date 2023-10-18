import React from "react";
import { User } from "../domain/user";
import { getLocalStorageItem } from "../application/infra/armazenamento/localStorage";
import { getCookie } from "../application/infra/armazenamento/coockie";
import SectorIndex from "../components/single/sectorIndex";
import { useNavigate } from "react-router-dom";

export default function IndexPage(){
    const navigate = useNavigate();
    const [user, setUser] = React.useState<User>();

    const renderComponent =(_user: User|undefined)=>{
        if(!user){
            return <></>
        }
        const cockie = getCookie('cisbafsession');
        if(!cockie) return to_logout();
        return <SectorIndex user={user} cockie={String(cockie)}/>
    }

    const to_logout =()=>{
        navigate("/logout");
        return <></>
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