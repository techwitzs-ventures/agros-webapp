import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';

export const getSinglePurchaseOrder = createAsyncThunk('orderApp/singlepurchaseorder/getSinglePurchaseOrder',
  async (queryparams) => {
    try {
      const result = await axios.get('/purchaseorder/getsinglepurchaseorderdetails', { params: queryparams })
      return result.data.response
    } catch (error) {
      console.log(error)
    }
  });

export const updatePurchaseOrder = createAsyncThunk('orderApp/singlepurchaseorder/updateSinglePurchaseOrder',
  async (updatedPurchaseOrderData, { dispatch, getState }) => {
    try {
      const result = await axios.put('/purchaseorder/update', {
        delivery_address: updatedPurchaseOrderData.delivery_address,
        exp_delivery_date: updatedPurchaseOrderData.exp_delivery_date,
        item_list: updatedPurchaseOrderData.item_list,
        total_amount: updatedPurchaseOrderData.total_amount.toString()
      }, {
        params: {
          tenant_id: updatedPurchaseOrderData.tenant_id,
          purchase_order_id: updatedPurchaseOrderData.purchase_order_id
        }
      })
      if (result.status === 200) {
        dispatch(showMessage({ message: result.data.message, variant: "success" }))
      } else {
        console.log(result);
      }
    } catch (error) {
      console.log(error)
    }
  }
);

export const saveSinglePurchaseOrder = createAsyncThunk('orderApp/singlepurchaseorder/saveSinglePurchaseOrder',
  async (purchaseOrderData, { dispatch, getState }) => {
    const result = await axios.post('/purchaseorder/create', {
      vendor_id: purchaseOrderData.data.vendor_id,
      delivery_address: purchaseOrderData.data.delivery_address,
      exp_delivery_date: purchaseOrderData.data.exp_delivery_date,
      item_list: purchaseOrderData.data.item_list,
      total_amount: purchaseOrderData.data.total_amount.toString(),
    },
      {
        params:
          { tenant_id: purchaseOrderData.org_id }
      })
    if (result.status === 200) {
      dispatch(showMessage({ message: result.data.message, variant: "success" }))
      return result.data.response
    } else {
      console.log(response)
    }
  }
);

const singlepurchaseorderSlice = createSlice({
  name: 'orderApp/singlepurchaseorder',
  initialState: null,
  reducers: {
    resetSinglePurchaseOrder: () => null,
    newSinglePurchaseOrder: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          /* when multiple plateform sellers or sellers are available then ,
          this vendor is field will become a empty string. */
          vendor_id: 'c56e3e85-fee8-4f35-943a-0081255acbf3',
          delivery_address: '',
          exp_delivery_date: '',
          item_list: [{
            items_wishlist_id: "",
            item_id: "",
            item_name: "",
            item_code: "",
            unit: "",
            rate: "",
            quantity: "",
            amount: "",
          }],
          total_amount: ""
        },
      }),
    },
  },
  extraReducers: {
    [getSinglePurchaseOrder.fulfilled]: (state, action) => action.payload,
    [saveSinglePurchaseOrder.fulfilled]: (state, action) => action.payload,
    [updatePurchaseOrder.fulfilled]: (state, action) => null,
  },
});

export const { newSinglePurchaseOrder, resetSinglePurchaseOrder } = singlepurchaseorderSlice.actions;

export const selectSinglePurchaseOrder = ({ orderApp }) => orderApp.singlepurchaseorder;

export default singlepurchaseorderSlice.reducer;
