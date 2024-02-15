import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getSalesOrders = createAsyncThunk('orderApp/salesorders/getSalesOrders',
  async (get_salesorders_obj) => {
    const result = await axios.get('/salesorder/getsalesorderlistbyorganizationId', {
      params: get_salesorders_obj
    })
    if (result.status === 200) {
      return result.data.response
    } else {
      console.log(result)
    }
  });

export const removeSalesOrders = createAsyncThunk(
  'orderApp/salesorders',
  () => {

  }
);

const salesordersAdapter = createEntityAdapter({});

export const { selectAll: selectSalesOrders, selectById: selectProductById } = salesordersAdapter.getSelectors((state) => state.orderApp.salesorders);

const salesordersSlice = createSlice({
  name: 'orderApp/salesorders',
  initialState: salesordersAdapter.getInitialState({
    searchText: '',
    activeStatus: false
  }),
  reducers: {
    setsalesordersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    setsalesordersActiveStatus: {
      reducer: (state, action) => {
        state.activeStatus = action.payload;
      },
      prepare: (event) => ({ payload: event.target.checked }),
    },
  },
  extraReducers: {
    [getSalesOrders.fulfilled]: salesordersAdapter.setAll,
    [removeSalesOrders.fulfilled]: (state, action) =>
      salesordersAdapter.removeMany(state, action.payload),
  },
});

export const { setsalesordersSearchText, setsalesordersActiveStatus } = salesordersSlice.actions;

export const selectSalesOrdersSearchText = ({ orderApp }) => orderApp.salesorders.searchText;
export const selectSalesOrdersActiveStatus = ({ orderApp }) => orderApp.salesorders.activeStatus;


export default salesordersSlice.reducer;