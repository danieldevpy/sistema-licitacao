import React from 'react';
import { setLocalStorageItem, getLocalStorageItem } from '@/application/infra/armazenamento/localStorage';
import { setCookie, getCookie } from '@/application/infra/armazenamento/coockie';
import { useRouter } from 'next/router';
import ProcessAPI from '@/application/infra/api/process';
import Process from '@/domain/entity/process';
import SectorAPI from '@/application/infra/api/sector';
import { Skeleton } from '@mui/material';
import { BadgeComponent } from '@/application/components/badge';
import {TableComponent, HeaderComponent} from '@/application/components/export';
import ColumnProcessSector from '@/application/infra/configs/columns';
import { useTheme } from '@/application/assets/themes/themeContext';
import SnackBarComponent from '@/application/components/snackBar';
import ModalProcessComponent from '@/application/components/modalProcess';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DispatchAPI from '@/application/infra/api/dispatch';
import { Sector } from '@/domain/entity/sector';
import Dispatch from '@/domain/entity/dispatch';
import {User} from '@/domain/entity/user';
import ModalCreateProcessCompoennt from '@/application/components/modalCreate';
import Box from '@mui/material/Box';
import FileUpload from '@/application/components/fileUpload';

interface SnackProps{
    message?: string;
    type: "success"|"error"|"info"|"warning";
    open: boolean;
}

export default function Home(){
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const api_process = new ProcessAPI();
    const api_sector = new SectorAPI();
    const api_dispatch = new DispatchAPI();
    const [visible, setVisible] = React.useState(false);
    const [processes, setProcesses] = React.useState<Process[]>([]);
    const [sectores, setSectores] = React.useState<Sector[]>([]);
    const [tableProcesses, setTableProcesses] = React.useState<Process[]>([]);
    const [awaitProcess, setAwaitProcess] = React.useState<Process[]>([]);
    const [dispatchs, setDispatchs] = React.useState<Dispatch[]>();
    const [snackProps, setSnackProps] = React.useState<SnackProps>({type: 'info', open: false});
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedProcess, setSelectedProcess] = React.useState<Process>();
    const [columns, setColumns] = React.useState<any>();
    const [selectedSector, setSelectedSector] = React.useState('');
    const [textObs, setTextObs] = React.useState('');
    const [user, setUser] = React.useState<User>();
    const [modalCreateOpen, setModalCreateOpen] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    
    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
      };


    React.useEffect(()=>{
        if(selectedProcess){
            api_dispatch.get_dispatch(selectedProcess.id)
            .then(response=>{
                if(response.status == 200){
                    const dispatch:Dispatch[] = response.data;
                    const last_obs = dispatch[dispatch.length-1].observation;
                    if(last_obs){
                        setTextObs(last_obs);
                    }
                    setDispatchs(dispatch);
                }
            })
        }

    }, [selectedProcess])

    const saveDispatch =(dispatch: Dispatch)=>{
        if(dispatch){
            try{
                api_dispatch.put_dispatch(dispatch);
            }
            catch (error){
                console.log(error);
            }
        }
    }

      
    const handleResize = () => {
        setColumns(ColumnProcessSector(window.innerWidth));
      };

    const createProcess = (number: string, obj: string, sector: number) =>{
        api_process.create_process(number, obj, sector)
        .then(response=>{
            if(response.status == 201){
                const copy = [...processes, response.data]
                setProcesses(copy);
                setSnackProps({type: "success", message: "Processo criado e encaminhado!", open: true})
            }
            setModalCreateOpen(false);
        })
        
    }

    const selectProcess =(process: any)=>{
        setSelectedProcess(Process.ConvertToClass(process.row));
        setModalOpen(true);
    }

    const closeModal =()=>{
        if(dispatchs){
            const last = dispatchs[dispatchs?.length-1];
            last.observation = textObs;
            saveDispatch(last);
        }
        setSelectedProcess(undefined);
        setModalOpen(false);
    }

    const endSnack =()=>{
        setSnackProps({type: "info", open: false})
    }

    const dispatch_process = async()=>{
        const process = selectedProcess
        if(!selectedSector){
            setSnackProps({type: "warning", message: "Selecione um setor", open: true})
            return
        }
        if(process){
            process.sector_id = Number(selectedSector);
            try{
                const result = await api_process.dispatch_process(process, textObs)
                if (result.status == 200){
                    if(dispatchs && selectedFile){
                        try{
                            const last_dispatch = dispatchs[dispatchs.length-1];
                            const response = await api_dispatch.upload_pdf(selectedFile, last_dispatch.id);
                            console.log("r", response);
                        }catch(error){
                            console.log("e", error);
                        }
                    }
        
                  
                    const new_processes = processes.filter((p)=>p.id != process.id);
                    const new_table = new_processes.filter((p)=>p.status == true);
                    setProcesses(new_processes);
                    setTableProcesses(new_table);
                    closeModal();
                    setSelectedSector('');
                    setDispatchs(undefined);
                    setSnackProps({type: "success", message: `O processo foi despachado`, open: true})
                }
            }catch(error){
                console.log(error);
            }
        }
    }
   
    const recieveProcess =(process: Process)=>{
        process.status = true;
        api_process.accept_process(process)
        .then(response=>{
            if(response.status == 200){
                const new_table = [...tableProcesses];
                new_table.push(new Process(process.id, process.number, process.object, process.sector, process.sector_id, process.status, process.active));
                const new_awaits = awaitProcess.filter((p)=> p.id !== process.id);
                setTableProcesses(new_table);
                setAwaitProcess(new_awaits);
                setSnackProps({type: "success", message: "Processo Recebido", open: true})
            }
        })
    }

    const request_api = async()=>{
        try{
            const results = await Promise.allSettled([
                api_process.get_process(),
                api_sector.get_sectores()
            ])

            if(results[0].status == "fulfilled"){
                const result_process  = results[0].value;

                if(result_process.status == 200){
                    const process: Process[] = result_process.data; 
                    setProcesses(process);

                }else if (result_process.status == 401){
                    router.push('/logout');
                }
            }

            if(results[1].status == "fulfilled"){
                const result_sectores = results[1].value;
                if(result_sectores.status == 200){
                    const sectores: Sector[] = result_sectores.data;
                    setSectores(sectores);
                }else if (result_sectores.status == 401){
                    router.push('/logout');
                }
            }
  
        }catch (error){
            console.log('error')
        }finally{
            setVisible(true);
        }
    }

    React.useEffect(()=>{
        if(processes){
            if(user?.is_adm){
                const p = processes.map((p)=>{return Process.ConvertToClass(p)});
                setTableProcesses(p);
                return
            }
            const filterTable = processes.filter((p) => p.status === true);
            const table_process: Process[] = filterTable.map((p)=>{
                return Process.ConvertToClass(p);
            })
            const filterAwait = processes.filter((p)=> p.status === false);
            const await_process: Process[] = filterAwait.map((p)=>{
                return Process.ConvertToClass(p);
            })

            setTableProcesses(table_process);
            setAwaitProcess(await_process);
        }
    }, [processes])

    React.useEffect(()=>{
        const coockie = getCookie('cisbafsession');
        if(coockie){
            api_process.set_cookie(String(coockie));
        }
        const _user = getLocalStorageItem('user');
        if(!_user){
            router.push('/logout')
        }
        setUser(_user);
        request_api();
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
          };
    }, []);



    return(
        <div className='w-screen h-screen' style={{backgroundColor:theme.pageBackgroundColor}}>
            <div className='main'>
                <HeaderComponent>
                    <div>
                        {user?.is_adm? (
                            <Button onClick={()=>{setModalCreateOpen(true)}}>+ Novo Processo</Button>
                        ):(
                            <BadgeComponent items={awaitProcess} count={awaitProcess?.length} toolTip='Processos Pendentes' recieve={recieveProcess}/>
                        )}
                    
                    </div>
                </HeaderComponent>
                {visible? (
                    <div className="boxmain" style={{backgroundColor: theme.componentBackgroundColor}}>
                        <label style={{color: theme.textColor}}>Lista de Processos</label>
                        <TableComponent columns={columns} rows={tableProcesses} dClicked={selectProcess}/>
                    </div>
                ):(
                    <div className='bg-white w-screen flex justify-center '>
                        <div className='flex flex-col w-1/2 gap-5 p-2'>
                        <Skeleton variant="rectangular" width={"100%"} height={60} />
                        <Skeleton variant="rectangular" width={"100%"} height={60} />
                        <Skeleton variant="rounded" width={"100%"} height={60} />    
                        <Skeleton variant="rounded" width={"100%"} height={60} />    
                        </div>
                    </div>

                )}
                <ModalProcessComponent title={user?.is_adm? "Visualizando Processo":"Despachar Processo"} open={modalOpen} fclose={closeModal} process={selectedProcess} dispatchs={dispatchs}>
                {user?.is_adm? (null):(
                    <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Setor</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedSector}
                                label="Setor"
                                onChange={(e)=>{setSelectedSector(e.target.value)}}
                            >
                                {sectores.map((sector, index)=>(
                                    <MenuItem key={index} value={sector.id}>{sector.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    <TextField
                        id="filled-multiline-static"
                        label="Observação"
                        multiline
                        rows={4}
                        placeholder='Envie uma observação para o proximo setor!'
                        variant="filled"
                        value={textObs}
                        onChange={(e)=>{setTextObs(e.target.value)}}
                        />
                        <FileUpload onFileSelect={handleFileSelect} />

                    <Button variant="contained" color="success" className='bg-slate-500' onClick={dispatch_process}>DESPACHAR PROCESSO</Button> 
                </Box>
                )}
                </ModalProcessComponent>
                <ModalCreateProcessCompoennt title='Criar Processo' open={modalCreateOpen}  sectores={sectores} created={createProcess} fclose={()=>{setModalCreateOpen(false)}}/>
                <SnackBarComponent snack={snackProps} end={endSnack}/>
            </div>
      </div>
    );
}

