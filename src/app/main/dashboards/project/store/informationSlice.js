import { createSlice } from '@reduxjs/toolkit';

const informationSlice = createSlice({
  name: 'projectDashboardApp/information',
  initialState: {
    productCount: "",
    purchaseOrderCount: "",
    salesOrderCount: "",
    invoiceCount: ""
  },
  reducers: {
    setProductCount: {
      reducer: (state, action) => {
        state.productCount = action.payload;
      },
      prepare: (event) => ({ payload: event })
    },
    setPurchaseOrderCount: {
      reducer: (state, action) => {
        state.purchaseOrderCount = action.payload;
      },
      prepare: (event) => ({ payload: event })
    },
    setSalesOrderCount: {
      reducer: (state, action) => {
        state.salesOrderCount = action.payload;
      },
      prepare: (event) => ({ payload: event })
    },
    setInvoiceCount: {
      reducer: (state, action) => {
        state.invoiceCount = action.payload;
      },
      prepare: (event) => ({ payload: event })
    }
  },
});

export const { setProductCount, setPurchaseOrderCount, setSalesOrderCount, setInvoiceCount } = informationSlice.actions

export const selectProductCount = ({ projectDashboardApp }) => projectDashboardApp.information.productCount;
export const selectPurchaseOrderCount = ({ projectDashboardApp }) => projectDashboardApp.information.purchaseOrderCount;
export const selectSalesOrderCount = ({ projectDashboardApp }) => projectDashboardApp.information.salesOrderCount;
export const selectInvoiceCount = ({ projectDashboardApp }) => projectDashboardApp.information.invoiceCount;
export const selectWidgets = ({ projectDashboardApp }) => projectDashboardApp.information

export default informationSlice.reducer;
