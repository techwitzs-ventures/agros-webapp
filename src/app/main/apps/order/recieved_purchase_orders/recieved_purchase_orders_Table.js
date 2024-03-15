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
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import {
    getRecievedPurchaseOrders,
    selectRecievedPurchaseOrders,
    selectRecievedPurchaseOrdersSearchText,
    selectRecievedPurchaseOrdersActiveStatus,
    changePurchaseOrderProcessingStatus
} from '../store/recieved_purchase_orders_Slice';
import RecievedPurchaseOrdersTableHead from './recieved_purchase_orders_TableHead';
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectTenant } from 'app/store/tenantSlice';
import POOrdersStatus from '../single_purchase_order/single_pruchase_order_status';


function RecievedPurchaseOrdersTable(props) {

    const dispatch = useDispatch();
    const recievedpurchaseorders = useSelector(selectRecievedPurchaseOrders);

    const user = useSelector(selectUser);
    const tenants = useSelector(selectTenant);

    const searchText = useSelector(selectRecievedPurchaseOrdersSearchText);
    const activeStatus = useSelector(selectRecievedPurchaseOrdersActiveStatus);

    const [selectedRecievedPurchaseOrderMenu, setSelectedRecievedPurchaseOrderMenu] = useState(null);
    const [selectedRecievedPurchaseOrder, setSelectedRecievedPurchaseOrder] = useState("")

    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]);

    const [acceptButtonLoading, setAcceptButtonLoading] = useState(false);
    const [rejectButtonLoading, setRejectButtonLoading] = useState(false);

    const [data, setData] = useState(recievedpurchaseorders);
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
            const get_recieved_purchase_order_obj = {
                org_id: user.tenant_id
            }
            dispatch(getRecievedPurchaseOrders(get_recieved_purchase_order_obj)).then((res) => {
                setLoading(false)
            });
        }
    }, [dispatch]);

    useEffect(() => {
        if (searchText.length !== 0) {
            setData(
                _.filter(recievedpurchaseorders, (order) => order.purchase_order_code.toLowerCase().includes(searchText.toLowerCase()))
            );
            setPage(0);
        } else {
            setData(recievedpurchaseorders);
        }
    }, [recievedpurchaseorders, searchText]);

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
        setSelectedRecievedPurchaseOrder(salesorder)
        setSelectedRecievedPurchaseOrderMenu(event.currentTarget);
    }

    function closeSelectedRecievedPurchaseOrderMenu() {
        setSelectedRecievedPurchaseOrderMenu(null);
        setSelectedRecievedPurchaseOrder("");
    }

    const getTenant = (selectedId) => {
        const selectedTenant = tenants.find(tenant => tenant.tenant_id === selectedId);
        return selectedTenant ? selectedTenant.tenant_name : '';
    };

    const navigateToSalesOrderCreationPage = async (receivedpurchaseorder) => {
        try {
            props.navigate(`/apps/order/salesorder/new/${receivedpurchaseorder.purchase_order_id}`)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAcceptOnlyState = async (purchase_order) => {
        try {
            setAcceptButtonLoading(true);
            const queryparams = {
                org_id: purchase_order.tenant_id,
                purchase_order_id: purchase_order.purchase_order_id,
                processingstatus: "vendor_accepted"
            }
            dispatch(changePurchaseOrderProcessingStatus(queryparams)).then(() => {
                const get_recieved_purchase_order_obj = {
                    org_id: user.tenant_id
                }
                dispatch(getRecievedPurchaseOrders(get_recieved_purchase_order_obj)).then((res) => {
                    closeSelectedRecievedPurchaseOrderMenu();
                    dispatch(showMessage({
                        message: `(${purchase_order.purchase_order_code.toUpperCase()}) Purchase Order Accepted!`,
                        variant: "success"
                    }))
                    setAcceptButtonLoading(false)
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleRejectState=async(purchase_order)=>{
        try {
            setRejectButtonLoading(true);
            const queryparams = {
                org_id: purchase_order.tenant_id,
                purchase_order_id: purchase_order.purchase_order_id,
                processingstatus: "vendor_rejected"
            }
            dispatch(changePurchaseOrderProcessingStatus(queryparams)).then(() => {
                const get_recieved_purchase_order_obj = {
                    org_id: user.tenant_id
                }
                dispatch(getRecievedPurchaseOrders(get_recieved_purchase_order_obj)).then((res) => {
                    closeSelectedRecievedPurchaseOrderMenu();
                    dispatch(showMessage({
                        message: `(${purchase_order.purchase_order_code.toUpperCase()}) Purchase Order Rejected!`,
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
                    There are no recieved purchase order!
                </Typography>
            </motion.div>
        );
    }

    return (
        <div className="w-full flex flex-col min-h-full">
            <FuseScrollbars className="grow overflow-x-auto">
                <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
                    <RecievedPurchaseOrdersTableHead
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
                                            {getTenant(n.customer_id)}
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
                                            <POOrdersStatus value={n.processing_status}/>
                                        </TableCell>

                                        <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                                            {n.total_amount}
                                        </TableCell>

                                        <TableCell className='p-4 md:p-16' component="th" scope="row" align="left">
                                            <IconButton
                                                aria-owns={selectedRecievedPurchaseOrderMenu ? 'selectedRecievedPurchaseOrderMenu' : null}
                                                aria-haspopup="true"
                                                onClick={(event) => openSelectedRecievedPurchaseOrderMenu(event, n)}
                                                size="small">
                                                <FuseSvgIcon>heroicons-outline:dots-horizontal</FuseSvgIcon>
                                            </IconButton>

                                            {selectedRecievedPurchaseOrder !== "" && <Menu
                                                id="selectedRecievedPurchaseOrderMenu"
                                                anchorEl={selectedRecievedPurchaseOrderMenu}
                                                open={Boolean(selectedRecievedPurchaseOrderMenu)}
                                                onClose={closeSelectedRecievedPurchaseOrderMenu}
                                            >
                                                <MenuList>
                                                    {selectedRecievedPurchaseOrder.processing_status === "submitted" && <MenuItem
                                                        onClick={() => {
                                                            closeSelectedRecievedPurchaseOrderMenu();
                                                            navigateToSalesOrderCreationPage(selectedRecievedPurchaseOrder)
                                                        }}
                                                    >
                                                        <ListItemText primary="Accept & Create Sales Order" />
                                                    </MenuItem>}

                                                    {selectedRecievedPurchaseOrder.processing_status === "submitted" && <MenuItem
                                                        onClick={() => {
                                                            handleAcceptOnlyState(selectedRecievedPurchaseOrder);
                                                        }}
                                                    >
                                                        {!acceptButtonLoading ?
                                                            <ListItemText primary="Accept Only" /> :
                                                            (<CircularProgress size={24} sx={{ color: grey[500] }} />)
                                                        }
                                                    </MenuItem>}

                                                    {selectedRecievedPurchaseOrder.processing_status === "vendor_accepted" && <MenuItem
                                                        onClick={() => {
                                                            closeSelectedRecievedPurchaseOrderMenu();
                                                            navigateToSalesOrderCreationPage(selectedRecievedPurchaseOrder)
                                                        }}
                                                    >
                                                        <ListItemText primary="Create Sales Order" />
                                                    </MenuItem>}

                                                    <MenuItem
                                                        onClick={() => {
                                                            closeSelectedRecievedPurchaseOrderMenu();
                                                            props.navigate(`/apps/order/viewpurchaseorder/${selectedRecievedPurchaseOrder.purchase_order_id}/${selectedRecievedPurchaseOrder.tenant_id}`)
                                                        }}
                                                    >
                                                        <ListItemText primary="View Purchase Order" />
                                                    </MenuItem>

                                                    {(
                                                        selectedRecievedPurchaseOrder.processing_status === "sales_order_created" ||
                                                        selectedRecievedPurchaseOrder.processing_status === "invoice_generated"
                                                    )
                                                        && <MenuItem
                                                            onClick={() => {
                                                                closeSelectedRecievedPurchaseOrderMenu();
                                                                props.navigate(`/apps/order/viewsalesorder/${selectedRecievedPurchaseOrder.sales_order_id}/${selectedRecievedPurchaseOrder.tenant_id}`)
                                                            }}
                                                        >
                                                            <ListItemText primary="View Sales Order" />
                                                        </MenuItem>}

                                                    {selectedRecievedPurchaseOrder.processing_status === "invoice_generated" && <MenuItem
                                                        onClick={() => {
                                                            closeSelectedRecievedPurchaseOrderMenu();
                                                            props.navigate(`/apps/invoice/${selectedRecievedPurchaseOrder.invoice_id}/${selectedRecievedPurchaseOrder.tenant_id}`)
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

export default withRouter(RecievedPurchaseOrdersTable);
