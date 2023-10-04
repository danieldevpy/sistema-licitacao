import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useTheme } from '@/application/assets/themes/themeContext';

interface TableProps{
    columns?: GridColDef[];
    rows?: any;
    dClicked?: any;
}

export default function TableComponent(props: TableProps){
    const { theme, toggleTheme } = useTheme();
    return(
        <DataGrid
        style={{minHeight: 400, color: theme.textColor}}
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