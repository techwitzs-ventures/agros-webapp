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
  getItemsCategories,
  selectItemsCategories,
  selectItemsCategoriesSearchText,
  selectItemsCategoriesActiveStatus
} from '../store/itemsCategoriesSlice';
import { updateItemsCategoryStatus } from '../store/itemsCategorySlice'
import ItemsCategoriesTableHead from './itemsCategoriesTableHead';
import { showMessage } from 'app/store/fuse/messageSlice';


function ItemsCategoriesTable(props) {

  const dispatch = useDispatch();
  const products = useSelector(selectItemsCategories);
  const user = useSelector(selectUser);

  const searchText = useSelector(selectItemsCategoriesSearchText);
  const activeStatus = useSelector(selectItemsCategoriesActiveStatus);

  const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);
  const [selectedItemCategory, setSelectedItemCategory] = useState("")

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
      const get_items_cat_obj = {
        organization_id: user.organization_id,
        active: activeStatus
      }
      dispatch(getItemsCategories(get_items_cat_obj)).then(() => setLoading(false));
    }
  }, [dispatch, activeStatus]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(products, (item) => item.items_cat_name.toLowerCase().includes(searchText.toLowerCase()))
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

  const editItemCategoryDetails = async (itemsCategory) => {
    try {
      props.navigate(`/apps/inventory/itemscategory/${itemsCategory.items_cat_id}`)
    } catch (error) {

    }
  }

  const handleUpdateItemsCategoryStatus = async (itemscategory) => {
    setLoading(true)
    const updated_status = {
      queryparams: {
        organization_id: itemscategory.organization_id,
        items_cat_id: itemscategory.items_cat_id
      },
      status: itemscategory.status ? false : true
    }
    dispatch(updateItemsCategoryStatus(updated_status)).then(() => {
      const get_items_cat_obj = {
        organization_id: itemscategory.organization_id,
        active: activeStatus
      }
      dispatch(getItemsCategories(get_items_cat_obj)).then(() => setLoading(false))
    });
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


  function openSelectedProductsMenu(event, itemscategory) {
    setSelectedItemCategory(itemscategory)
    setSelectedProductsMenu(event.currentTarget);
  }

  function closeSelectedProductsMenu() {
    setSelectedProductsMenu(null);
    setSelectedItemCategory("");
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
          There are no items category!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <ItemsCategoriesTableHead
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
                      {n.items_cat_name}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      {n.items_cat_code}
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

                    <TableCell className='p-4 md:p-16' component="th" scope="row" align="left">
                      <IconButton
                        aria-owns={selectedProductsMenu ? 'selectedProductsMenu' : null}
                        aria-haspopup="true"
                        onClick={(event) => openSelectedProductsMenu(event, n)}
                        size="small">
                        <FuseSvgIcon>heroicons-outline:dots-horizontal</FuseSvgIcon>
                      </IconButton>
                      {selectedItemCategory !== "" && <Menu
                        id="selectedProductsMenu"
                        anchorEl={selectedProductsMenu}
                        open={Boolean(selectedProductsMenu)}
                        onClose={closeSelectedProductsMenu}
                      >
                        <MenuList>
                          <MenuItem
                            onClick={() => {
                              editItemCategoryDetails(selectedItemCategory)
                              closeSelectedProductsMenu();
                            }}
                          >
                            <ListItemText primary="Edit" />
                          </MenuItem>

                          <MenuItem onClick={() => {
                            handleUpdateItemsCategoryStatus(selectedItemCategory);
                            closeSelectedProductsMenu();
                          }}>
                            {selectedItemCategory.status ? <ListItemText primary="Deactivate" /> : <ListItemText primary="Activate" />}
                          </MenuItem>

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

export default withRouter(ItemsCategoriesTable);
