import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';


export const getInvoice = createAsyncThunk('invoiceApp/invoice/getInvoice',
  async (get_invoice_obj) => {

    const result = await axios.get(
      '/invoices/getinvoice',
      {
        params: {
          invoice_id: get_invoice_obj.invoice_id
        }
      }
    )

    return result.data.response

  });

export const removeInvoice = createAsyncThunk('invoiceApp/invoice/removeInvoice',
  async () => {

  }
);

export const saveInvoice = createAsyncThunk('invoiceApp/invoice/saveInvoice',
  async (invoiceData, { dispatch, getState }) => {

    const result = await axios.post(
      '/invoices/create_invoice',
      {
        customer_id: invoiceData.data.customer_id,
        item_list: invoiceData.data.item_list,
        currency: invoiceData.data.currency,
        total_amount: invoiceData.data.total_amount
      }, {
      params: {
        tenant_id: invoiceData.tenant_id,
        stripe_account_id: invoiceData.stripe_account_id,
        stripe_customer_id: invoiceData.data.stripe_customer_id
      }
    }
    )
    if (result.status === 201) {
      dispatch(showMessage({ message: result.data.message, variant: "success" }))
      return result.data.response
    } else {
      console.log(result)
    }

  })

const invoiceSlice = createSlice({
  name: 'invoiceApp/invoice',
  initialState: null,
  reducers: {
    resetInvoice: () => null,
    newInvoice: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          customer_id: '',
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
          currency: '',
          total_amount: ''
        },
      }),
    }
  },
  extraReducers: {
    [getInvoice.fulfilled]: (state, action) => action.payload,
    [saveInvoice.fulfilled]: (state, action) => action.payload,
  },
});

export const { newInvoice, resetInvoice } = invoiceSlice.actions;

export const selectInvoice = ({ invoiceApp }) => invoiceApp.invoice;

export default invoiceSlice.reducer;