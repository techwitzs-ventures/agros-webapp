import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableHead from '@mui/material/TableHead';
import { lighten } from '@mui/material/styles';
import { selectUser } from 'app/store/userSlice';

const rows = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email',
    sort: true,
  },
  {
    id: 'mobilenumber',
    align: 'left',
    disablePadding: false,
    label: 'Mobile No.',
    sort: true,
  },
  {
    id: 'action',
    align: 'left',
    disablePadding: false,
    label: 'Action',
    sort: true,
  },
];

function CustomersTableHead(props) {

  const { selectedCustomerIds } = props;
  // const numSelected = selectedCustomerIds.length;

  const [selectedCustomersMenu, setSelectedCustomersMenu] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedCustomersMenu(event) {
    setSelectedCustomersMenu(event.currentTarget);
  }

  function closeSelectedCustomersMenu() {
    setSelectedCustomersMenu(null);
  }

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
              sortDirection={props.order.id === row.id ? props.order.direction : false}
            >
              {row.sort && (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.order.id === row.id}
                    direction={props.order.direction}
                    onClick={createSortHandler(row.id)}
                    className="font-semibold"
                  >
                   {row.label}
                  </TableSortLabel>
                </Tooltip>
              )}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default CustomersTableHead;
