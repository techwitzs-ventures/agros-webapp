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
  selectSalesOrdersSearchText,
  selectSalesOrdersActiveStatus
} from '../store/sales_orders_Slice';
import AllSalesOrdersTableHead from './all_sales_orders_TableHead';
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectTenant } from 'app/store/tenantSlice';
import { selectAllSalesOrders } from 'app/store/allSalesOrdersSlice';
import SOOrdersStatus from '../single_sales_order/single_sales_order_status';


function AllSalesOrdersTable(props) {

  const salesorders = useSelector(selectAllSalesOrders);

  const tenants = useSelector(selectTenant);

  const searchText = useSelector(selectSalesOrdersSearchText);
  const activeStatus = useSelector(selectSalesOrdersActiveStatus);

  const [selectedSalesOrderMenu, setSelectedSalesOrderMenu] = useState(null);
  const [selectedSalesOrder, setSelectedSalesOrder] = useState("")

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  const [data, setData] = useState(salesorders);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });


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

  const handleViewInvoice = async (salesorder) => {
    setLoading(true)
    try {
      props.navigate(`/apps/invoice/${salesorder.invoice_id}/${salesorder.tenant_id}`);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  const getTenant = (selectedId) => {
    const selectedTenant = tenants.find(tenant => tenant.tenant_id === selectedId);
    return selectedTenant;
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
          There are no sales orders!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <AllSalesOrdersTableHead
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
                      {n.purchase_order_code !== "N/A" ? n.purchase_order_code : " - "}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.invoice_code !== "N/A" ? n.invoice_code : " - "}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {getTenant(n.customer_id).tenant_name}
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
                      <SOOrdersStatus value={n.processing_status} />
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {`${n.total_amount} ( ${getTenant(n.customer_id).currency_code} )`}
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

                          {<MenuItem onClick={() => {
                            closeSelectedSalesOrderMenu();
                          }}>
                            < ListItemText primary="View Sales Order" />
                          </MenuItem>}

                          {selectedSalesOrder.purchase_order_id !== "N/A" && <MenuItem onClick={() => {
                            closeSelectedSalesOrderMenu();
                          }}>
                            < ListItemText primary="View Purchase Order" />
                          </MenuItem>}

                          {selectedSalesOrder.invoice_id !== "N/A" && <MenuItem onClick={() => {
                            closeSelectedSalesOrderMenu();
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

export default withRouter(AllSalesOrdersTable);
