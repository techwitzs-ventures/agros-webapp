import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getInvoiceList = createAsyncThunk("invoiceApp/invoices/getInvoiceList",
  async (get_invoices_obj) => {

    const result = await axios.get(
      '/invoices/getinvoicesbytenantid',
      {
        params: {
          tenant_id: get_invoices_obj.tenant_id
        }
      }
    );

      return result.data.response
      
  }
);


const invoicesAdapter = createEntityAdapter({});

export const { selectAll: selectInvoices, selectById: selectProductById }
  = invoicesAdapter.getSelectors((state) => state.invoiceApp.invoices);

const invoicesSlice = createSlice({
  name: "invoiceApp/invoices",
  initialState: invoicesAdapter.getInitialState({
    searchText: "",
    activeStatus: false
  }),
  reducers: {
    setInvoicesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    setInvoiceActiveStatus: {
      reducer: (state, action) => {
        state.activeStatus = action.payload;
      },
      prepare: (event) => ({ payload: event.target.checked }),
    },
  },
  extraReducers: {
    [getInvoiceList.fulfilled]: invoicesAdapter.setAll,
  },
});

export const { setInvoicesSearchText, setInvoiceActiveStatus } = invoicesSlice.actions;

export const selectInvoicesSearchText = ({ invoiceApp }) => invoiceApp.invoices.searchText;
export const selectInvoiceActiveStatus = ({ invoiceApp }) => invoiceApp.invoices.activeStatus;

export default invoicesSlice.reducer;
