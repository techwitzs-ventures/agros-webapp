import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showMessage } from "app/store/fuse/messageSlice";
import { getSinglePurchaseOrder } from "./single_purchase_order_Slice";
import axios from "axios";


export const getSingleSalesOrder = createAsyncThunk("orderApp/singlesalesorder/getSingleSalesOrder",
  async (queryparams) => {
    try {
      const result = await axios.get('/salesorder/getsinglesalesorderdetails', { params: queryparams })
      return result.data.response
    } catch (error) {
      console.log(error);
    }
  }
);

export const getSingleReceivedPurchaseOrder = createAsyncThunk("orderApp/singlesalesorder/getsinglereceivedpurchaseorder",
  async (queryparams, { dispatch, getState }) => {
    try {
      return dispatch(getSinglePurchaseOrder(queryparams)).then((result) => {
        return {
          customer_id: result.payload.customer_id,
          purchase_order_id: result.payload.purchase_order_id,
          purchase_order_code: result.payload.purchase_order_code,
          delivery_address: result.payload.delivery_address,
          exp_shipment_date: result.payload.exp_delivery_date,
          item_list: result.payload.item_list,
          total_amount: result.payload.total_amount
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
)

export const updateSalesOrder = createAsyncThunk("orderApp/singlesalesorder/updateSingleSalesOrder",
  async (updatedSalesOrderData, { dispatch, getState }) => {
    const result = await axios.put('/salesorder/update', {
      delivery_address: updatedSalesOrderData.delivery_address,
      exp_shipment_date: updatedSalesOrderData.exp_shipment_date,
      item_list: updatedSalesOrderData.item_list,
      total_amount: updatedSalesOrderData.total_amount.toString(),
    }, {
      params: {
        tenant_id: updatedSalesOrderData.tenant_id,
        sales_order_id: updatedSalesOrderData.sales_order_id
      }
    })
    if (result.status === 200) {
      dispatch(showMessage({ message: result.data.message, variant: "success" }))
    } else {
      console.log(result);
    }
  }
);

export const saveSingleSalesOrder = createAsyncThunk("orderApp/singlesalesorder/savesingleSalesOrder",
  async (salesOrderData, { dispatch, getState }) => {

    const result = await axios.post('/salesorder/create', {
      customer_id: salesOrderData.data.customer_id,
      purchase_order_id: salesOrderData.data.purchase_order_id,
      purchase_order_code: salesOrderData.data.purchase_order_code,
      delivery_address: salesOrderData.data.delivery_address,
      exp_shipment_date: salesOrderData.data.exp_shipment_date,
      item_list: salesOrderData.data.item_list,
      total_amount: salesOrderData.data.total_amount.toString(),
    },
      {
        params:
          { tenant_id: salesOrderData.org_id }
      })
    if (result.status === 200) {
      dispatch(showMessage({ message: result.data.message, variant: "success" }))
      return result.data.response
    } else {
      console.log(response)
    }
  }
);

const singlesalesOrderSlice = createSlice({
  name: "orderApp/singlesalesorder",
  initialState: null,
  reducers: {
    resetSingleSalesOrder: () => null,
    newSingleSalesOrder: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          customer_id: "",
          purchase_order_id: "N/A",
          purchase_order_code: "N/A",
          delivery_address: "",
          exp_shipment_date: "",
          item_list: [
            {
              item_id: "",
              item_name: "",
              item_code: "",
              unit: "",
              rate: "",
              quantity: "",
              amount: "",
            },
          ],
          total_amount: "",
        },
      }),
    },
  },
  extraReducers: {
    [getSingleSalesOrder.fulfilled]: (state, action) => action.payload,
    [getSingleReceivedPurchaseOrder.fulfilled]: (state, action) => action.payload,
    [saveSingleSalesOrder.fulfilled]: (state, action) => action.payload,
    [updateSalesOrder.fulfilled]: (state, action) => null,
  },
});

export const { newSingleSalesOrder, resetSingleSalesOrder } = singlesalesOrderSlice.actions;

export const selectSingleSalesOrder = ({ orderApp }) => orderApp.singlesalesorder;

export default singlesalesOrderSlice.reducer;
