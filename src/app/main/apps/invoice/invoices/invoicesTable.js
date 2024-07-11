import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
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
  getInvoiceList,
  selectInvoices,
  selectInvoicesSearchText,
  selectInvoiceActiveStatus
} from "../store/invoicesSlice";
import InvoicesTableHead from "./invoicesTableHead";
import { showMessage } from "app/store/fuse/messageSlice";
import { getCustomers } from "../../customers/store/customersSlice";

function InvoicesTable(props) {

  const dispatch = useDispatch();
  const invoices = useSelector(selectInvoices);
  const user = useSelector(selectUser);

  const searchText = useSelector(selectInvoicesSearchText);
  const activeStatus = useSelector(selectInvoiceActiveStatus);

  const [customers, setcustomers] = useState([])
  const [selectedInvoicesMenu, setSelectedInvoicesMenu] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState("");

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  const [data, setData] = useState(invoices);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [invoiceData, setInvoiceData] = useState({
    direction: "asc",
    id: null,
  });

  useEffect(() => {
    if (user) {
      user.data.country === "" &&
        dispatch(showMessage({ message: "Address Not Updated!", variant: "warning" }));
      setLoading(true);
      const get_invoices_obj = {
        tenant_id: user.tenant_id,
        // active_status: activeStatus,
      };
      dispatch(getInvoiceList(get_invoices_obj)).then((res) => {
        dispatch(getCustomers({ tenant_id: user.tenant_id })).then((res) => {
          setcustomers(res.payload)
          setLoading(false);
        })
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(invoices, (invoiceData) =>
          invoiceData.invoice_code.toLowerCase().includes(searchText.toLowerCase()))
      );
      setPage(0);
    } else {
      setData(invoices);
    }
  }, [invoices, searchText]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = "desc";

    if (invoiceData.id === property && invoiceData.direction === "desc") {
      direction = "asc";
    }

    setInvoiceData({
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

  function openSelectedInvoiceMenu(event, invoice) {
    setSelectedInvoices(invoice);
    setSelectedInvoicesMenu(event.currentTarget);
  }

  function closeSelectedInvoiceMenu() {
    setSelectedInvoicesMenu(null);
    setSelectedInvoices("");
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
          There are no Invoices!
        </Typography>
      </motion.div>
    );
  }

  const getCustomer = (customerId) => {
    const customer = customers.find((customer) => customer.customer_id === customerId);
    return `${customer.firstname} ${customer.lastname}`
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <InvoicesTableHead
            selectedProductIds={selected}
            invoiceData={invoiceData}
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
                  switch (invoiceData.id) {
                    case "categories": {
                      return o.categories[0];
                    }
                    default: {
                      return o[invoiceData.id];
                    }
                  }
                },
              ],
              [invoiceData.direction]
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
                      {n.invoice_code}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {customers.length > 0 && getCustomer(n.customer_id) || "Customer Name"}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {n.item_list.length}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {n.status ? "active" : "inactive"}
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
                      <IconButton
                        aria-owns={
                          selectedInvoicesMenu ? "selectedInvoicesMenu" : null
                        }
                        aria-haspopup="true"
                        onClick={(event) =>
                          openSelectedInvoiceMenu(event, n)
                        }
                        size="small"
                      >
                        <FuseSvgIcon>
                          heroicons-outline:dots-horizontal
                        </FuseSvgIcon>
                      </IconButton>
                      {selectedInvoices !== "" && (
                        <Menu
                          id="selectedInvoicesMenu"
                          anchorEl={selectedInvoicesMenu}
                          open={Boolean(selectedInvoicesMenu)}
                          onClose={closeSelectedInvoiceMenu}
                        >
                          <MenuList>

                            <MenuItem
                              onClick={() => {
                                closeSelectedInvoiceMenu();
                                props.navigate(`/apps/invoice/invoices/${selectedInvoices.invoice_id}`)
                              }}
                            >
                              <ListItemText
                                primary="View Invoice"
                              />
                            </MenuItem>

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

export default withRouter(InvoicesTable);
