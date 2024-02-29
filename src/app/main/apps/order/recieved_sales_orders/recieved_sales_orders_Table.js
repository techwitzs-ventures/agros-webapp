import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import withRouter from "@fuse/core/withRouter";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  getRecievedSalesOrders,
  selectRecievedSalesorders,
  selectRecievedSalesOrdersSearchText,
  selectRecievedSalesOrdersActiveStatus,
  changeSalesOrderProcessingStatus,
} from "../store/recieved_sales_orders_Slice";
import RecievedSalesOrdersTableHead from "./recieved_sales_orders_TableHead";
import { showMessage } from "app/store/fuse/messageSlice";
import { selectOrganization } from "app/store/organizationSlice";
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';
import SOOrdersStatus from "../single_sales_order/single_sales_order_status";

function RecievedSalesOrdersTable(props) {
  const dispatch = useDispatch();
  const recievedpurchaseorders = useSelector(selectRecievedSalesorders);

  const user = useSelector(selectUser);
  const organizations = useSelector(selectOrganization);

  const searchText = useSelector(selectRecievedSalesOrdersSearchText);
  const activeStatus = useSelector(selectRecievedSalesOrdersActiveStatus);

  const [selectedRecievedPurchaseOrderMenu, setSelectedRecievedPurchaseOrderMenu] = useState(null);
  const [selectedRecievedPurchaseOrder, setSelectedRecievedPurchaseOrder] = useState("");

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  const [acceptButtonLoading, setAcceptButtonLoading] = useState(false);
  const [rejectButtonLoading, setRejectButtonLoading] = useState(false);

  const [data, setData] = useState(recievedpurchaseorders);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });

  useEffect(() => {
    if (user) {
      user.data.country === "" &&
        dispatch(
          showMessage({ message: "Address Not Updated!", variant: "warning" })
        );
      setLoading(true);
      const get_recieved_purchase_order_obj = {
        org_id: user.organization_id,
      };
      dispatch(getRecievedSalesOrders(get_recieved_purchase_order_obj)).then((res) => { setLoading(false) });
    }
  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(_.filter(recievedpurchaseorders, (order) => order.sales_order_code.toLowerCase().includes(searchText.toLowerCase())));
      setPage(0);
    } else {
      setData(recievedpurchaseorders);
    }
  }, [recievedpurchaseorders, searchText]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = "desc";

    if (order.id === property && order.direction === "desc") {
      direction = "asc";
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

  function openSelectedRecievedPurchaseOrderMenu(event, salesorder) {
    setSelectedRecievedPurchaseOrder(salesorder);
    setSelectedRecievedPurchaseOrderMenu(event.currentTarget);
  }

  function closeSelectedRecievedPurchaseOrderMenu() {
    setSelectedRecievedPurchaseOrderMenu(null);
    setSelectedRecievedPurchaseOrder("");
  }

  const getOrganization = (selectedId) => {
    const selectedOrganization = organizations.find(organization => organization.organization_id === selectedId);
    return selectedOrganization ? selectedOrganization.organization_name : '';
  };

  const handleAcceptOnlyState = async (sales_order) => {
    try {
      setAcceptButtonLoading(true);
      const queryparams = {
        org_id: sales_order.organization_id,
        sales_order_id: sales_order.sales_order_id,
        processingstatus: "buyer_accepted"
      }
      dispatch(changeSalesOrderProcessingStatus(queryparams)).then(() => {
        const get_recieved_purchase_order_obj = {
          org_id: user.organization_id,
        };
        dispatch(getRecievedSalesOrders(get_recieved_purchase_order_obj)).then(() => {
          closeSelectedRecievedPurchaseOrderMenu();
          dispatch(showMessage({
            message: `(${sales_order.sales_order_code.toUpperCase()}) Sales Order Accepted!`,
            variant: "success"
          }))
          setAcceptButtonLoading(false)
        });
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleRejectState = async (sales_order) => {
    try {
      setRejectButtonLoading(true);
      const queryparams = {
        org_id: sales_order.organization_id,
        sales_order_id: sales_order.sales_order_id,
        processingstatus: "buyer_rejected"
      }
      dispatch(changeSalesOrderProcessingStatus(queryparams)).then(() => {
        const get_recieved_purchase_order_obj = {
          org_id: user.organization_id
        }
        dispatch(getRecievedSalesOrders(get_recieved_purchase_order_obj)).then((res) => {
          closeSelectedRecievedPurchaseOrderMenu();
          dispatch(showMessage({
            message: `(${sales_order.sales_order_code.toUpperCase()}) Sales Order Rejected!`,
            variant: "success"
          }))
          setRejectButtonLoading(false)
        })
      })
    } catch (error) {
      console.log(error)
    }
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
          There are no recieved sales order!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <RecievedSalesOrdersTableHead
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
                    case "categories": {
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
                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.sales_order_code}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.purchase_order_code !== "N/A" ? n.purchase_order_code : " - "}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.invoice_code !== "N/A" ? n.invoice_code : " - "}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {getOrganization(n.vendor_id)}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16 truncate"
                      component="th"
                      scope="row"
                    >
                      {new Date(n.createdAt).toLocaleDateString("en-In", {
                        timeZone: "Asia/Kolkata",
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {new Date(n.exp_shipment_date).toLocaleDateString("en-In", {
                        timeZone: "Asia/Kolkata",
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {n.item_list.length}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      <SOOrdersStatus value={n.processing_status} />
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {n.total_amount}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      <IconButton
                        aria-owns={selectedRecievedPurchaseOrderMenu ? "selectedRecievedPurchaseOrderMenu" : null}
                        aria-haspopup="true"
                        onClick={(event) => openSelectedRecievedPurchaseOrderMenu(event, n)}
                        size="small"
                      >
                        <FuseSvgIcon>
                          heroicons-outline:dots-horizontal
                        </FuseSvgIcon>
                      </IconButton>

                      {selectedRecievedPurchaseOrder !== "" && (
                        <Menu
                          id="selectedRecievedPurchaseOrderMenu"
                          anchorEl={selectedRecievedPurchaseOrderMenu}
                          open={Boolean(selectedRecievedPurchaseOrderMenu)}
                          onClose={closeSelectedRecievedPurchaseOrderMenu}
                        >
                          <MenuList>
                            {selectedRecievedPurchaseOrder.processing_status === "submitted" && <MenuItem
                              onClick={() => {
                                handleAcceptOnlyState(selectedRecievedPurchaseOrder);
                              }}
                            >
                              {!acceptButtonLoading ?
                                <ListItemText primary="Accept" /> :
                                (<CircularProgress size={24} sx={{ color: grey[500] }} />)
                              }
                            </MenuItem>}

                            {<MenuItem
                              onClick={() => {
                                closeSelectedRecievedPurchaseOrderMenu();
                                props.navigate(`/apps/order/viewsalesorder/${selectedRecievedPurchaseOrder.sales_order_id}/${selectedRecievedPurchaseOrder.organization_id}`)
                              }}
                            >
                              <ListItemText primary="View Sales Order" />
                            </MenuItem>}

                            {selectedRecievedPurchaseOrder.purchase_order_id !== "N/A" && <MenuItem
                              onClick={() => {
                                closeSelectedRecievedPurchaseOrderMenu();
                                props.navigate(`/apps/order/viewpurchaseorder/${selectedRecievedPurchaseOrder.purchase_order_id}/${selectedRecievedPurchaseOrder.organization_id}`)
                              }}
                            >
                              <ListItemText primary="View Purchase Order" />
                            </MenuItem>}

                            {selectedRecievedPurchaseOrder.processing_status === "invoice_generated" && <MenuItem
                              onClick={() => {
                                closeSelectedRecievedPurchaseOrderMenu();
                                props.navigate(`/apps/invoice/${selectedRecievedPurchaseOrder.invoice_id}/${selectedRecievedPurchaseOrder.organization_id}`)
                              }}
                            >
                              <ListItemText primary="View Invoice" />
                            </MenuItem>}

                            {selectedRecievedPurchaseOrder.processing_status === "submitted" && <MenuItem
                              onClick={() => {
                                handleRejectState(selectedRecievedPurchaseOrder)
                              }}
                            >
                              {!rejectButtonLoading ?
                                <ListItemText primary="Reject" /> :
                                (<CircularProgress size={24} sx={{ color: grey[500] }} />)
                              }
                            </MenuItem>}

                          </MenuList>
                        </Menu>
                      )}
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
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default withRouter(RecievedSalesOrdersTable);
