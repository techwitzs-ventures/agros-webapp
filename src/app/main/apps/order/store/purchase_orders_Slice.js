import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getPurchaseOrders = createAsyncThunk("orderApp/purchaseorders/getPurchaseOrders",
  async (get_purchaseorders_obj) => {
    const result = await axios.get('/purchaseorder/getpurchaseorderlistbytenantId', {
      params: get_purchaseorders_obj
    })
    if (result.status === 200) {
      return result.data.response
    } else {
      console.log(result)
    }
  }
);

export const removePurchaseOrders = createAsyncThunk("orderApp/purchaseorders",
  () => { }
);

const purchaseordersAdapter = createEntityAdapter({});

export const { selectAll: selectPurchaseOrders, selectById: selectProductById } = purchaseordersAdapter.getSelectors((state) => state.orderApp.purchaseorders);

const purchaseordersSlice = createSlice({
  name: "orderApp/purchaseorders",
  initialState: purchaseordersAdapter.getInitialState({
    searchText: "",
    activeStatus: false,
  }),
  reducers: {
    setpurchaseordersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    setpurchaseordersActiveStatus: {
      reducer: (state, action) => {
        state.activeStatus = action.payload;
      },
      prepare: (event) => ({ payload: event.target.checked }),
    },
  },
  extraReducers: {
    [getPurchaseOrders.fulfilled]: purchaseordersAdapter.setAll,
    [removePurchaseOrders.fulfilled]: (state, action) =>
      purchaseordersAdapter.removeMany(state, action.payload)
  },
});

export const { setpurchaseordersSearchText, setpurchaseordersActiveStatus } = purchaseordersSlice.actions;

export const selectPurchaseOrdersSearchText = ({ orderApp }) => orderApp.purchaseorders.searchText;
export const selectPurchaseOrdersActiveStatus = ({ orderApp }) => orderApp.purchaseorders.activeStatus;

export default purchaseordersSlice.reducer;
