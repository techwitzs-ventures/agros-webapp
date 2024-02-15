import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const getRecievedPurchaseOrders = createAsyncThunk('orderApp/recievedpurchaseorders/getRecievedPurchaseOrders',
  async (get_recievedpurchaseorders_obj) => {
    const result = await axios.get('/purchaseorder/receivedpurchaseorder', {
      params: {
        organization_id: get_recievedpurchaseorders_obj.org_id
      }
    })
    if (result.status === 200) {
      return result.data.response
    } else {
      console.log(result)
    }
  });

export const changePurchaseOrderProcessingStatus = createAsyncThunk('orderApp/receivedpurchaseorders/changePurchaseOrderProcessingStatus',
  async (update_obj) => {
    try {
      await axios.put('/purchaseorder/changeprocessingstatus', null, {
        params: {
          organization_id: update_obj.org_id,
          purchase_order_id: update_obj.purchase_order_id,
          processing_status: update_obj.processingstatus
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
)

export const removeRecievedPurchaseOrders = createAsyncThunk('orderApp/recievedpurchaseorders',
  () => {

  }
);

const recievedpurchaseordersAdapter = createEntityAdapter({});

export const { selectAll: selectRecievedPurchaseOrders, selectById: selectProductById } =
  recievedpurchaseordersAdapter.getSelectors((state) => state.orderApp.recievedpurchaseorders);

const recievedpurchaseordersSlice = createSlice({
  name: 'orderApp/recievedpurchaseorders',
  initialState: recievedpurchaseordersAdapter.getInitialState({
    searchText: '',
    activeStatus: false
  }),
  reducers: {
    setrecievedpurchaseordersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    setrecievedpurchaseordersActiveStatus: {
      reducer: (state, action) => {
        state.activeStatus = action.payload;
      },
      prepare: (event) => ({ payload: event.target.checked }),
    },
  },
  extraReducers: {
    [getRecievedPurchaseOrders.fulfilled]: recievedpurchaseordersAdapter.setAll,
    [removeRecievedPurchaseOrders.fulfilled]: (state, action) =>
      removeRecievedPurchaseOrders.removeMany(state, action.payload),
  },
});

export const { setrecievedpurchaseordersSearchText, setrecievedpurchaseordersActiveStatus } = recievedpurchaseordersSlice.actions;

export const selectRecievedPurchaseOrdersSearchText = ({ orderApp }) => orderApp.recievedpurchaseorders.searchText;
export const selectRecievedPurchaseOrdersActiveStatus = ({ orderApp }) => orderApp.recievedpurchaseorders.activeStatus;


export default recievedpurchaseordersSlice.reducer;