import React from "react";
import { User } from "../../domain/user";
import { Sector } from "../../domain/sector";
import SectorAPI from "../../application/infra/api/sector";
import ProcessAPI from "../../application/infra/api/process";
import Process from "../../domain/process";
import Dispatch from "../../domain/dispatch";
import DispatchAPI from "../../application/infra/api/dispatch";
import { useMediaQuery } from 'react-responsive';
import TableComponent from "../reusable/tableProcess";
import ResponsiveAppBar from "../reusable/appBar";
import { Box, Skeleton, Typography } from "@mui/material";
import ColumnProcessSector from "../../application/infra/configs/columns";
import ModalProcessComponent from "./modalProcess";
import InteractiveList from "../reusable/listProcess";
import DispatchProcessComponent from "./dispatchProcess";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import BadgeProcessComponent from "./badgeProcess";
import ModalProcessCreateComponent from "./modalProcessCreate";
import { SnackBarComponent, SnackInfo, ErrorSnack } from "../reusable/snackBar";
import '../../assets/css/index.css'

interface SectorIndexProps{
    user: User;
    cockie: string;
}

interface SelectedProcess{
    editable: boolean;
    process: Process;
}

export default function SectorIndex(props: SectorIndexProps){
    const user = props.user;
    const apiSector = new SectorAPI();
    const apiProcess = new ProcessAPI();
    const windowWidth = window.innerWidth;
    const isMobile = useMediaQuery({ maxWidth: 900});
    const [sectores, setSectores] = React.useState<Sector[]>();
    const [processes, setProcesses] = React.useState<Process[]>();
    const [tableProcess, setTableProcess] = React.useState<Process[]>();
    const [selectedProcess, setSelectedProcess] = React.useState<SelectedProcess>();
    const [visibleModalProcess, setVisibleModalProcess] = React.useState(false);
    const [visibleModalCreate, setVisibleModalCreate] = React.useState(false);
    const [extensionModal, setExtensionModal] = React.useState<any>();
    const [dispatchs, setDispatchs] = React.useState<Dispatch[]>();
    const [snackState, setSnackState] = React.useState(false);
    const [snackInfo, setSnackInfo] = React.useState(new SnackInfo());
    const [loadingData, setLoadingData] = React.useState(true);

    React.useEffect(()=>{
        try{
            const timer = setTimeout(() => {
                setLoadingData(false);
            }, 200);
            apiSector.set_cookie(props.cockie);
            apiSector.get_sectores()
            .then(response=>{
                if(response.status != 200) throw new ErrorSnack("ERROR 1", "error")
                setSectores(response.data);
            })
            apiProcess.get_process()
            .then(response=>{
                if(response.status != 200) throw new ErrorSnack("ERROR 2", "error")
                const _processes = response.data.map((process:Process)=>{
                    return Process.ConvertToClass(process);
                })
                setProcesses(_processes);
            })
            .finally(()=>{
                clearTimeout(timer);
                setLoadingData(true);
            })
        }catch (error: any){
            if (error instanceof ErrorSnack) {
                snackInfo.message = error.message;
                snackInfo.type = error.type;
                setSnackInfo(snackInfo);
                return setSnackState(true);
            }
            console.error('Error desconhecido:', error.message);
        }
    }, [])

    React.useEffect(()=>{
        if(!processes) return;
        if(user.is_staff){
            const p = processes.filter(p=>{
                if(p.sector_id != user.sector_id ){
                    return p
                }else{
                    if(p.status != false){
                        return p
                    }
                }
            })
            return setTableProcess(p);
        }
        if(processes.length > 0) return setTableProcess(processes?.filter(p=>p.status === true));
        setTableProcess([]);
    }, [processes])

    React.useEffect(()=>{
        if(!selectedProcess?.process) return;
        const api = new DispatchAPI();
        api.get_dispatch(selectedProcess.process.id)
        .then(response=>{
            if(response.status != 200) return
            setDispatchs(response.data);
        })

    }, [selectedProcess])

    const open_process =(item: any)=>{
        const p: Process = item.row;
        const equal = (p.sector_id === user.sector_id);
        setSelectedProcess({process: p, editable: equal})
        setVisibleModalProcess(true);
    }

    return(
        <Box className="mainindex">
            <>
            <ResponsiveAppBar
                user={user}
                menu={user.is_adm? [{name: "Novo Processo", icon: <CreateNewFolderIcon/>, to_click: ()=>{setVisibleModalCreate(true)}}]:[]}>
                <BadgeProcessComponent
                    sector_user={user.sector_id}
                    processes={processes}
                    setSelected={setSelectedProcess}
                    modal={setVisibleModalProcess}
                    extesion={setExtensionModal}
                    commit={setProcesses}
                    snackState={setSnackState}
                    snackInfo={setSnackInfo}/>
            </ResponsiveAppBar>
            <Typography  
                sx={{
                marginLeft: 2,
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.0rem',
                color: 'black',
                textDecoration: 'none',
                marginBottom: 2,
                }}>LISTA DE PROCESSOS</Typography>
            {loadingData?(
                <>
                {isMobile?(
                    <InteractiveList
                    processes={tableProcess}
                    dClick={open_process}/>
                ):(
                    <TableComponent
                    columns={ColumnProcessSector(windowWidth)}
                    rows={tableProcess}
                    dClicked={open_process}/>
                )}
                </>
            ):(
                <Box className="skeleton">
                    <Skeleton variant="rectangular" width={250} height={60} />
                    <Skeleton variant="rectangular" width={"100%"} height={35} />
                    <Skeleton variant="rounded" width={"100%"} height={35} />    
                    <Skeleton variant="rounded" width={"100%"} height={35} />    
                    <Skeleton variant="rounded" width={"100%"} height={35} />    
                    <Skeleton variant="rounded" width={"100%"} height={35} />    
                </Box>
            )}
            <ModalProcessComponent
                process={selectedProcess?.process}
                dispatchs={dispatchs}
                open={visibleModalProcess} title="Visualização do Processo"
                fclose={()=>{setVisibleModalProcess(false)}}
                isMobile={isMobile}>
                {selectedProcess?.editable?(
                    <DispatchProcessComponent 
                        process={selectedProcess.process}
                        dispatchs={dispatchs}
                        sectores={sectores}
                        allProcess={processes}
                        commit={setProcesses}
                        snackState={setSnackState}
                        snackInfo={setSnackInfo}
                        modal={setVisibleModalProcess}/>
                ):(null)}
                {extensionModal}
            </ModalProcessComponent>
            <ModalProcessCreateComponent
                open={visibleModalCreate}
                modal={setVisibleModalCreate}
                title="Novo Processo"
                sectores={sectores}
                snackState={setSnackState}
                snackInfo={setSnackInfo}/>
            <SnackBarComponent state={snackState} setState={setSnackState} info={snackInfo}/>
            </>
        </Box>
    );


}