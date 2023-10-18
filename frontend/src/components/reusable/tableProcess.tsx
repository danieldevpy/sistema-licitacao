import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface TableProps{
    columns?: GridColDef[];
    rows?: any;
    dClicked?: any;
}

export default function TableComponent(props: TableProps){
    return(
        <DataGrid
        style={{minHeight: 400}}
        className='tableProcess'
        rows={props.rows||[]}
        columns={props.columns||[]}
        onRowDoubleClick={props.dClicked}
        initialState={{
            pagination: {
            paginationModel: { page: 0, pageSize: 5 },
            },
        }}
        pageSizeOptions={[5, 10]}
        
        />
    )

}