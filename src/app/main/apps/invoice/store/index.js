import { combineReducers } from "@reduxjs/toolkit";
import invoice from "./invoice_Slice";
import invoices from "./received_invoices_Slice";
import myinvoices from './my_invoices_Slice';

const reducer = combineReducers({
  invoice,
  invoices,
  myinvoices
});

export default reducer;
