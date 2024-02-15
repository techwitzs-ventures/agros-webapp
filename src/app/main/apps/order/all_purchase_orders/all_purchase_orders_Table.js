import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
  selectPurchaseOrdersSearchText,
  selectPurchaseOrdersActiveStatus,
} from '../store/purchase_orders_Slice';
import AllPurchaseOrdersTableHead from './all_purchase_orders_TableHead';
import { selectOrganization } from 'app/store/organizationSlice';
import { selectAllPurchaseOrders } from 'app/store/allPurchaseOrdersSlice';

function AllPurchaseOrdersTable(props) {

  const prchase_orders = useSelector(selectAllPurchaseOrders);

  const organizations = useSelector(selectOrganization)

  const searchText = useSelector(selectPurchaseOrdersSearchText);
  const activeStatus = useSelector(selectPurchaseOrdersActiveStatus);

  const [selectedPurchaseOrderMenu, setSelectedPurchaseOrderMenu] = useState(null);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState("")

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  const [data, setData] = useState(prchase_orders);
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(prchase_orders, (order) => order.purchase_order_code.toLowerCase().includes(searchText.toLowerCase()))
      );
      setPage(0);
    } else {
      setData(prchase_orders);
    }
  }, [prchase_orders, searchText]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  const getOrganization = (selectedId) => {
    const selectedOrganization = organizations.find(organization => organization.organization_id === selectedId);
    return selectedOrganization;
  };

  function handleCheck(event, id) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  function openselectedPurchaseOrderMenu(event, item) {
    setSelectedPurchaseOrder(item)
    setSelectedPurchaseOrderMenu(event.currentTarget);
  }

  function closeselectedPurchaseOrderMenu() {
    setSelectedPurchaseOrderMenu(null);
    setSelectedPurchaseOrder("")
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no purchase orders!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <AllPurchaseOrdersTableHead
            selectedProductIds={selected}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onMenuItemClick={handleDeselect}
          />

          <TableBody>
            {_.orderBy(
              data,
              [
                (o) => {
                  switch (order.id) {
                    case 'categories': {
                      return o.categories[0];
                    }
                    default: {
                      return o[order.id];
                    }
                  }
                },
              ],
              [order.direction]
            )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n) => {
                const isSelected = selected.indexOf(n.id) !== -1;
                return (
                  <TableRow
                    className="h-72 cursor-pointer"
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                  >

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.purchase_order_code}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.sales_order_code !== "N/A" ? n.sales_order_code : " - "}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.invoice_code !== "N/A" ? n.invoice_code : " - "}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {getOrganization(n.vendor_id).organization_name}
                    </TableCell>

                    <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
                      {new Date(n.date).toLocaleDateString("en-In", {
                        timeZone: "Asia/Kolkata",
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {new Date(n.exp_delivery_date).toLocaleDateString("en-In", {
                        timeZone: "Asia/Kolkata",
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {n.item_list.length}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {n.status ? (
                        <span className='flex items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0'>
                          <FuseSvgIcon className="text-green" size={20}>
                            heroicons-outline:check-circle
                          </FuseSvgIcon><span className='ps-2'>active</span>
                        </span>
                      ) : (
                        <span className='flex items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0'>
                          <FuseSvgIcon className="text-red" size={20}>
                            heroicons-outline:minus-circle
                          </FuseSvgIcon><span className='ps-2'>inactive</span>
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {`${n.total_amount} ( ${getOrganization(n.vendor_id).currency_code} )`}
                    </TableCell>

                    <TableCell className='p-4 md:p-16' component="th" scope="row" align="left">
                      <IconButton
                        aria-owns={selectedPurchaseOrderMenu ? 'selectedPurchaseOrderMenu' : null}
                        aria-haspopup="true"
                        onClick={(event) => openselectedPurchaseOrderMenu(event, n)}
                        size="small">
                        <FuseSvgIcon>heroicons-outline:dots-horizontal</FuseSvgIcon>
                      </IconButton>

                      {selectedPurchaseOrder !== "" && <Menu
                        id="selectedPurchaseOrderMenu"
                        anchorEl={selectedPurchaseOrderMenu}
                        open={Boolean(selectedPurchaseOrderMenu)}
                        onClose={closeselectedPurchaseOrderMenu}
                      >
                        <MenuList>
                          {<MenuItem onClick={() => {
                            closeselectedPurchaseOrderMenu();
                          }}>
                            <ListItemText primary="View Purchase Order" />
                          </MenuItem>}

                          {selectedPurchaseOrder.sales_order_id !== "N/A" && <MenuItem onClick={() => {
                            closeselectedPurchaseOrderMenu();
                          }}>
                            <ListItemText primary="View Sales Order" />
                          </MenuItem>}

                          {selectedPurchaseOrder.invoice_id !== "N/A" && <MenuItem onClick={() => {
                            closeselectedPurchaseOrderMenu();
                          }}>
                            <ListItemText primary="View Invoice" />
                          </MenuItem>}
                        </MenuList>
                      </Menu>}

                    </TableCell>

                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="shrink-0 border-t-1"
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default withRouter(AllPurchaseOrdersTable);