import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getMyInvoiceList = createAsyncThunk("invoiceApp/myinvoices/getMyInvoiceList",
  async (get_myinvoices_obj) => {
    const result = await axios.get('/invoice/getinvoicelistbyorganizationId', {
      params: {
        organization_id: get_myinvoices_obj.org_id
      }
    })
    if (result.status === 200) {
      return result.data.response
    } else {
      console.log(result)
    }
  }
);


const myinvoicesAdapter = createEntityAdapter({});

export const { selectAll: selectMyInvoices, selectById: selectProductById } = myinvoicesAdapter.getSelectors((state) => state.invoiceApp.myinvoices);

const myinvoicesSlice = createSlice({
  name: "invoiceApp/myinvoices",
  initialState: myinvoicesAdapter.getInitialState({
    searchText: "",
    activeStatus: false
  }),
  reducers: {
    setMyInvoicesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    setMyInvoiceActiveStatus: {
      reducer: (state, action) => {
        state.activeStatus = action.payload;
      },
      prepare: (event) => ({ payload: event.target.checked }),
    },
  },
  extraReducers: {
    [getMyInvoiceList.fulfilled]: myinvoicesAdapter.setAll,
  },
});

export const { setMyInvoicesSearchText, setMyInvoiceActiveStatus } = myinvoicesSlice.actions;

export const selectMyInvoicesSearchText = ({ invoiceApp }) => invoiceApp.myinvoices.searchText;
export const selectMyInvoiceActiveStatus = ({ invoiceApp }) => invoiceApp.myinvoices.activeStatus;

export default myinvoicesSlice.reducer;
