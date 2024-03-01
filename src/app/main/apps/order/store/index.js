import { combineReducers } from '@reduxjs/toolkit';
import singlepurchaseorder from './single_purchase_order_Slice';
import singlesalesorder from './single_sales_order_Slice'
import salesorders from './sales_orders_Slice';
import purchaseorders from './purchase_orders_Slice';
import vendorlist from './vendor_Slice'
import recievedpurchaseorders from './recieved_purchase_orders_Slice'
import recievedsalesorders from './recieved_sales_orders_Slice'

const reducer = combineReducers({
  salesorders,
  purchaseorders,
  recievedpurchaseorders,
  recievedsalesorders,
  singlepurchaseorder,
  singlesalesorder,
  vendorlist
});

export default reducer;
