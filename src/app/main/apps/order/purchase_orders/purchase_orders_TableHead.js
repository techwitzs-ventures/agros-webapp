import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import TableHead from '@mui/material/TableHead';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import { removeProducts } from '../store/sales_orders_Slice';
import { selectUser } from 'app/store/userSlice';

const rows = [

  {
    id: 'pocode',
    align: 'left',
    disablePadding: false,
    label: 'PO Code',
    sort: true,
  },
  {
    id: 'socode',
    align: 'left',
    disablePadding: false,
    label: 'SO Code',
    sort: true,
  },
  {
    id: 'ivcode',
    align: 'left',
    disablePadding: false,
    label: 'Invoice Code',
    sort: true,
  },
  {
    id: 'vendor_name',
    align: 'left',
    disablePadding: false,
    label: 'Vendor Name',
    sort: true,
  },
  {
    id: 'created_at',
    align: 'left',
    disablePadding: false,
    label: 'Created At',
    sort: true,
  },
  {
    id: 'exp_delivery_date',
    align: 'left',
    disablePadding: false,
    label: 'Exp. Delivery Date',
    sort: true,
  },
  {
    id: 'no_of_items',
    align: 'left',
    disablePadding: false,
    label: '# Items',
    sort: true,
  },
  {
    id: 'pro_status',
    align: 'left',
    disablePadding: false,
    label: 'Processing Status',
    sort: true,
  },
  {
    id: 'total_amount',
    align: 'left',
    disablePadding: false,
    label: 'Amount',
    sort: true,
  },
  {
    id: 'action',
    align: 'left',
    disablePadding: false,
    label: 'Action',
    sort: true,
  }
];

function PurchaseOrdersTableHead(props) {
  const { selectedProductIds } = props;
  const numSelected = selectedProductIds.length;

  const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedProductsMenu(event) {
    setSelectedProductsMenu(event.currentTarget);
  }

  function closeSelectedProductsMenu() {
    setSelectedProductsMenu(null);
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
                    {
                         row.id === 'total_amount' ?
                         `${row.label} (${!user.data.country !== "" && user.organization_data.currency_code})` :
                         row.label
                    }
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

export default PurchaseOrdersTableHead;
