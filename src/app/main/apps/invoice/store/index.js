import { combineReducers } from "@reduxjs/toolkit";
import invoice from "./invoiceSlice";
import invoices from './invoicesSlice';

const reducer = combineReducers({
  invoice,
  invoices
});

export default reducer;
