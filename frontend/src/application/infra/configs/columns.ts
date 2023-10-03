
const ColumnProcessSector =(widht: number)=>{

    const columns = [

        {
            field: 'id',
            headerName: 'ID',
            description: 'Id do Processo',
            width: 100,
            minWidth: 50,
        },
        {
            field: 'number',
            headerName: 'Numero do Processo',
            description: 'Numero do Processo',
            width: widht/5,
            minWidth: 100,
        },
        {
            field: 'object',
            headerName: 'Objeto do Processo',
            description: 'Objeto do Processo',
            width: widht/5,
            minWidth: 100,
        },
        {
            field: 'sector',
            headerName: 'Setor',
            description: 'Setor',
            width: widht/5,
            minWidth: 50,
        },
        {
            field: 'status_name',
            headerName: 'Status do Processo',
            description: 'Status do Processo',
            width: widht/5,
            minWidth: 100,
        },
      ];
    return  columns
}
  
export default ColumnProcessSector;