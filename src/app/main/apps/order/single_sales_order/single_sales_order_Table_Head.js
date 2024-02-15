import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';


const rows = [
    {
        id: 'item_name',
        align: 'left',
        disablePadding: false,
        label: 'ITEM DETAILS',
    },
    {
        id: 'unit',
        align: 'left',
        disablePadding: false,
        label: 'UNIT',
    },
    {
        id: 'quantity',
        align: 'left',
        disablePadding: false,
        label: 'QUANTITY',
    },
    {
        id: 'rate',
        align: 'left',
        disablePadding: false,
        label: 'RATE',
    },
    {
        id: 'amount',
        align: 'left',
        disablePadding: false,
        label: 'AMOUNT',
    },
    {
        id: 'action',
        align: 'left',
        disablePadding: false,
        label: 'ACTION',
    },
];

function SingleSalesOrderTableHead() {
    return (
        <TableHead>
            <TableRow className="h-48 sm:h-64">
                {rows.map((row) => {
                    return (
                        <TableCell
                            sx={{
                                backgroundColor: (theme)=>theme.palette.common.black,
                                color:(theme)=>theme.palette.common.white
                            }}
                            className="p-4 md:p-16"
                            key={row.id}
                            align={row.align}
                            padding={row.disablePadding ? 'none' : 'normal'}
                        >
                            {
                                row.label
                            }
                        </TableCell>
                    );
                }, this)}
            </TableRow>
        </TableHead>
    );
}

export default SingleSalesOrderTableHead;
