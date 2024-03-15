import { combineReducers } from '@reduxjs/toolkit';
import fuse from './fuse';
import i18n from './i18nSlice';
import user from './userSlice';
import tenant from './tenantSlice';
import items from './allItemsSlice';
import itemscategories from './allItemsCategoriesSlice';
import purchaseorders from './allPurchaseOrdersSlice';
import salesorders from './allSalesOrdersSlice';
import invoices from './allInvoicesSlice';

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse,
    i18n,
    user,
    tenant,
    items,
    itemscategories,
    purchaseorders,
    salesorders,
    invoices,
    ...asyncReducers,
  });

  /*
  Reset the redux store when user logged out
   */
  if (action.type === 'user/userLoggedOut') {
    // state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;
