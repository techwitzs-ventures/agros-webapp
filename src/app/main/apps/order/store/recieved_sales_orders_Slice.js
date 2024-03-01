import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getRecievedSalesOrders = createAsyncThunk("orderApp/recievedsalesorders/getRecievedSalesOrders",
  async (get_recievedsalesorders_obj) => {
    const result = await axios.get('/salesorder/receivedsalesorder', {
      params: {
        organization_id: get_recievedsalesorders_obj.org_id
      }
    })
    if (result.status === 200) {
      return result.data.response
    } else {
      console.log(result)
    }
  }
);

export const changeSalesOrderProcessingStatus = createAsyncThunk('orderApp/recievedsalesorders/changeSalesOrderProcessingStatus',
  async (update_obj) => {
    try {
      await axios.put('/salesorder/changeprocessingstatus', null, {
        params: {
          organization_id: update_obj.org_id,
          sales_order_id: update_obj.sales_order_id,
          processing_status: update_obj.processingstatus
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
)

const recievedsalesordersAdaptersSlice = createEntityAdapter({});

export const { selectAll: selectRecievedSalesorders, selectById: selectProductById } = recievedsalesordersAdaptersSlice.getSelectors((state) => state.orderApp.recievedsalesorders);

const recievedsalesordersSlice = createSlice({
  name: "orderApp/recievedsalesorders",
  initialState: recievedsalesordersAdaptersSlice.getInitialState({
    searchText: "",
    activeStatus: false,
  }),
  reducers: {
    setrecievedsalesordersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    setrecievedsalesordersActiveStatus: {
      reducer: (state, action) => {
        state.activeStatus = action.payload;
      },
      prepare: (event) => ({ payload: event.target.checked }),
    },
  },
  extraReducers: {
    [getRecievedSalesOrders.fulfilled]: recievedsalesordersAdaptersSlice.setAll,
  },
});

export const { setrecievedsalesordersSearchText, setrecievedsalesordersActiveStatus } = recievedsalesordersSlice.actions;

export const selectRecievedSalesOrdersSearchText = ({ orderApp }) => orderApp.recievedsalesorders.searchText;

export const selectRecievedSalesOrdersActiveStatus = ({ orderApp }) => orderApp.recievedsalesorders.activeStatus;

export default recievedsalesordersSlice.reducer;
