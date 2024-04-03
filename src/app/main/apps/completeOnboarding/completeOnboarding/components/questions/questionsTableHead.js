import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import { lighten } from '@mui/material/styles';

const rows = [
    {
        id: 'id',
        align: 'left',
        disablePadding: true,
        label: 'S.No.',
        sort: false,
    },
    {
        id: 'question',
        align: 'left',
        disablePadding: false,
        label: 'Question',
        sort: false,
    },
    {
        id: 'options',
        align: 'left',
        disablePadding: false,
        label: 'Action',
        sort: false,
    },
];

function QuestionsTableHead(props) {

    return (
        <TableHead>
            <TableRow className="h-48 sm:h-64">
                {rows.map((row) => {
                    return (
                        <TableCell
                            sx={{
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'light'
                                        ? lighten(theme.palette.background.default, 0.4)
                                        : lighten(theme.palette.background.default, 0.02),
                            }}
                            className="p-4 md:p-16"
                            key={row.id}
                            align={row.align}
                            padding={row.disablePadding ? 'none' : 'normal'}
                        >
                            {row.label}
                        </TableCell>
                    );
                }, this)}
            </TableRow>
        </TableHead>
    );
}

export default QuestionsTableHead;
