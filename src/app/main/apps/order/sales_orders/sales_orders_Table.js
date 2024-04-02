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
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
  getSalesOrders,
  selectSalesOrders,
  selectSalesOrdersSearchText,
  selectSalesOrdersActiveStatus
} from '../store/sales_orders_Slice';
import SalesOrdersTableHead from './sales_orders_TableHead';
import { showMessage } from 'app/store/fuse/messageSlice';
import { saveInvoice } from '../../invoice/store/invoice_Slice';
import { selectTenant } from 'app/store/tenantSlice';
import SOOrdersStatus from '../single_sales_order/single_sales_order_status';


function SalesOrdersTable(props) {

  const dispatch = useDispatch();

  const salesorders = useSelector(selectSalesOrders);

  const user = useSelector(selectUser);
  const tenants = useSelector(selectTenant);

  const searchText = useSelector(selectSalesOrdersSearchText);
  const activeStatus = useSelector(selectSalesOrdersActiveStatus);

  const [selectedSalesOrderMenu, setSelectedSalesOrderMenu] = useState(null);
  const [selectedSalesOrder, setSelectedSalesOrder] = useState("")

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  const [data, setData] = useState(salesorders);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  useEffect(() => {
    if (user) {
      user.data.country === "" && dispatch(showMessage({ message: "Address Not Updated!", variant: "warning" }))
      setLoading(true)
      const get_salesorder_obj = {
        tenant_id: user.tenant_id,
        active: activeStatus
      }
      dispatch(getSalesOrders(get_salesorder_obj)).then((res) => {
        setLoading(false)
      });
    }
  }, [dispatch, activeStatus]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(salesorders, (order) => order.sales_order_code.toLowerCase().includes(searchText.toLowerCase()))
      );
      setPage(0);
    } else {
      setData(salesorders);
    }
  }, [salesorders, searchText]);

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

  const handleCreateInvoice = async (salesorder) => {
    setLoading(true)
    try {
        const obj = {
          data: {
            customer_id: salesorder.customer_id,
            sales_order_id: salesorder.sales_order_id,
            sales_order_code: salesorder.sales_order_code,
            purchase_order_id: salesorder.purchase_order_id,
            purchase_order_code: salesorder.purchase_order_code,
            due_date: 'Pay after 7 days',
            total_due: salesorder.total_amount,
            total_amount: salesorder.total_amount
          },
          org_id: salesorder.tenant_id
        }
        dispatch(saveInvoice(obj)).then((action) => {
          props.navigate(`/apps/invoice/${action.payload.invoice_id}/${action.payload.tenant_id}`);
          setLoading(false)
        }).catch((error) => {
          console.log(error)
        })
    } catch (error) {
      console.log(error);
    }
  }

  const getTenant = (selectedId) => {
    const selectedTenant = tenants.find(tenant => tenant.tenant_id === selectedId);
    return selectedTenant ? selectedTenant.tenant_name : '';
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

  function openSelectedSalesOrderMenu(event, salesorder) {
    setSelectedSalesOrder(salesorder)
    setSelectedSalesOrderMenu(event.currentTarget);
  }

  function closeSelectedSalesOrderMenu() {
    setSelectedSalesOrderMenu(null);
    setSelectedSalesOrder("");
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
          There are no sales order!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <SalesOrdersTableHead
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
                      {n.sales_order_code}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.purchase_order_code !== "N/A" ? n.purchase_order_code : (<span className='flex items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0'>
                          <span style={{ borderBottom: "3px solid black" }} className='w-12'></span>
                        </span>)}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.invoice_code !== "N/A" ? n.invoice_code : (<span className='flex items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0'>
                          <span style={{ borderBottom: "3px solid black" }} className='w-12'></span>
                        </span>)}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {getTenant(n.customer_id)}
                    </TableCell>

                    <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
                      {new Date(n.createdAt).toLocaleDateString("en-In", {
                        timeZone: "Asia/Kolkata",
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {new Date(n.exp_shipment_date).toLocaleDateString("en-In", {
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
                      <SOOrdersStatus value={n.processing_status}/>
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {n.total_amount}
                    </TableCell>

                    <TableCell className='p-4 md:p-16' component="th" scope="row" align="left">
                      <IconButton
                        aria-owns={selectedSalesOrderMenu ? 'selectedSalesOrderMenu' : null}
                        aria-haspopup="true"
                        onClick={(event) => openSelectedSalesOrderMenu(event, n)}
                        size="small">
                        <FuseSvgIcon>heroicons-outline:dots-horizontal</FuseSvgIcon>
                      </IconButton>
                      {selectedSalesOrder !== "" && <Menu
                        id="selectedSalesOrderMenu"
                        anchorEl={selectedSalesOrderMenu}
                        open={Boolean(selectedSalesOrderMenu)}
                        onClose={closeSelectedSalesOrderMenu}
                      >
                        <MenuList>
                          <MenuItem
                            onClick={() => {
                              closeSelectedSalesOrderMenu();
                              props.navigate(`/apps/order/viewsalesorder/${selectedSalesOrder.sales_order_id}/${selectedSalesOrder.tenant_id}`)
                            }}
                          >
                            <ListItemText primary="View Sales Order" />
                          </MenuItem>

                          {selectedSalesOrder.processing_status === "submitted" && <MenuItem
                            onClick={() => {
                              closeSelectedSalesOrderMenu();
                              props.navigate(`/apps/order/salesorder/${selectedSalesOrder.sales_order_id}/${selectedSalesOrder.tenant_id}`)
                            }}
                          >
                            <ListItemText primary="Withdraw & Edit" />
                          </MenuItem>}

                          {selectedSalesOrder.purchase_order_id !== "N/A" && <MenuItem
                            onClick={() => {
                              closeSelectedSalesOrderMenu();
                              props.navigate(`/apps/order/viewpurchaseorder/${selectedSalesOrder.purchase_order_id}/${selectedSalesOrder.tenant_id}`)
                            }}
                          >
                            <ListItemText primary="View Purchase Order" />
                          </MenuItem>}

                          {selectedSalesOrder.processing_status === "retailer_accepted" && <MenuItem onClick={() => {
                            handleCreateInvoice(selectedSalesOrder);
                            closeSelectedSalesOrderMenu();
                          }}>
                            < ListItemText primary="Create Invoice" />
                          </MenuItem>}

                          {selectedSalesOrder.processing_status === "invoice_generated" && <MenuItem onClick={() => {
                            closeSelectedSalesOrderMenu();
                            props.navigate(`/apps/invoice/${selectedSalesOrder.invoice_id}/${selectedSalesOrder.tenant_id}`)
                          }}>
                            < ListItemText primary="View Invoice" />
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

export default withRouter(SalesOrdersTable);
