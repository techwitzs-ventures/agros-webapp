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
import { selectUser } from 'app/store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
  getWishlistItems,
  selectWishlistItems,
  selectWishlistItemsSearchText,
  selectWishlistItemsActiveStatus,
} from '../store/wishlistItemsSlice';
import WishlistItemsTableHead from './wishlistItemsTableHead';
import { updateItemStatus } from '../store/itemSlice';
import { showMessage } from 'app/store/fuse/messageSlice';

function WishlistItemsTable(props) {

  const dispatch = useDispatch();
  const products = useSelector(selectWishlistItems);
  const user = useSelector(selectUser);

  const searchText = useSelector(selectWishlistItemsSearchText);
  const activeStatus = useSelector(selectWishlistItemsActiveStatus);

  const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);
  const [selectedItem, setSelectedItem] = useState("")

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  const [data, setData] = useState(products);
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
      const get_wishlistitems_obj = {
        tenant_id: user.tenant_id,
        active: activeStatus
      }
      dispatch(getWishlistItems(get_wishlistitems_obj)).then(() => setLoading(false));
    }
  }, [dispatch, activeStatus]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(products, (item) => item.item_name.toLowerCase().includes(searchText.toLowerCase()))
      );
      setPage(0);
    } else {
      setData(products);
    }
  }, [products, searchText]);

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

  const viewWishlistItemDetails = async (wishlistItem) => {

    try {
      props.navigate(`/apps/inventory/itemswishlist/view/${wishlistItem.items_wishlist_id}`);
    } catch (error) {
      console.log(error)
    }

  }

  const editCustomWishlistItem = async (wishlistItem) => {

    try {
      props.navigate(`/apps/inventory/customitemswishlist/${wishlistItem.items_wishlist_id}`)
    } catch (error) {
      console.log(error)
    }

  }

  const updateWishlistItem = async (wishlistItem) => {

    try {
      props.navigate(`/apps/inventory/itemswishlist/update/${wishlistItem.items_wishlist_id}`)
    } catch (error) {
      console.log(error)
    }

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

  function openSelectedProductsMenu(event, wishlistitem) {
    setSelectedItem(wishlistitem)
    setSelectedProductsMenu(event.currentTarget);
  }

  function closeSelectedProductsMenu() {
    setSelectedProductsMenu(null);
    setSelectedItem("")
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
          There are no items!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <WishlistItemsTableHead
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

                    <TableCell
                      className="w-52 px-4 md:px-0"
                      component="th"
                      scope="row"
                      padding="none"
                    >
                      {n.images.length > 0 && n.featuredImageId ? (
                        <img
                          className="w-full block rounded ml-12"
                          src={_.find(n.images, { id: n.featuredImageId }).url}
                          alt={n.item_name}
                        />
                      ) : (
                        <img
                          className="w-full block rounded"
                          src="assets/images/apps/ecommerce/product-image-placeholder.png"
                          alt={n.item_name}
                        />
                      )}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.item_name}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {n.sku}
                    </TableCell>

                    <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
                      {n.rate}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {n.unit}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {n.status ? (
                        <span className='flex items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0'>
                          <FuseSvgIcon className="text-green" size={20}>
                            heroicons-outline:check-circle
                          </FuseSvgIcon>
                        </span>
                      ) : (
                        <span className='flex items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0'>
                          <span style={{ borderBottom: "3px solid black" }} className='w-12'></span>
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {n.quantity}
                    </TableCell>

                    <TableCell className='p-4 md:p-16' component="th" scope="row" align="left">
                      <IconButton
                        aria-owns={selectedProductsMenu ? 'selectedProductsMenu' : null}
                        aria-haspopup="true"
                        onClick={(event) => openSelectedProductsMenu(event, n)}
                        size="small">
                        <FuseSvgIcon>heroicons-outline:dots-horizontal</FuseSvgIcon>
                      </IconButton>

                      {selectedItem !== "" && <Menu
                        id="selectedProductsMenu"
                        anchorEl={selectedProductsMenu}
                        open={Boolean(selectedProductsMenu)}
                        onClose={closeSelectedProductsMenu}
                      >
                        <MenuList>
                          {selectedItem.status && <MenuItem
                            onClick={() => {
                              viewWishlistItemDetails(selectedItem)
                              closeSelectedProductsMenu();
                            }}
                          >
                            <ListItemText primary="View" />
                          </MenuItem>}

                          {!selectedItem.status && <MenuItem onClick={() => {
                            editCustomWishlistItem(selectedItem);
                            closeSelectedProductsMenu();
                          }}>
                            <ListItemText primary="Edit" />
                          </MenuItem>}

                          {selectedItem.status && <MenuItem onClick={() => {
                            updateWishlistItem(selectedItem);
                            closeSelectedProductsMenu();
                          }}>
                            <ListItemText primary="Update" />
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

export default withRouter(WishlistItemsTable);
