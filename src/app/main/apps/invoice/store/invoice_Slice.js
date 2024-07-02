import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const getInvoice = createAsyncThunk('invoiceApp/invoice/getinvoice',
  async (get_invoice_obj) => {
    const result = await axios.get('/invoice/getsingleinvoicedetails', {
      params: {
        tenant_id: get_invoice_obj.org_id,
        invoice_id: get_invoice_obj.invoice_id
      }
    })
    if (result.status === 200) {
      return result.data.response
    } else {
      console.log(result)
    }
  });

export const removeInvoice = createAsyncThunk(
  'invoiceApp/invoice',
  () => {

  }
);

export const saveInvoice = createAsyncThunk('invoiceApp/saveinvoice',
  async (invoiceData, { dispatch, getState }) => {
    const result = await axios.post('/invoice/create',
      {
        customer_id: invoiceData.data.customer_id,
        sales_order_id: invoiceData.data.sales_order_id,
        sales_order_code: invoiceData.data.sales_order_code,
        purchase_order_id: invoiceData.data.purchase_order_id,
        purchase_order_code: invoiceData.data.purchase_order_code,
        due_date: invoiceData.data.due_date,
        total_due: invoiceData.data.total_due,
        total_amount: invoiceData.data.total_amount
      }, {
      params: {
        tenant_id: invoiceData.tenant_id,
        stripe_account_id: invoiceData.stripe_account_id,
        stripe_customer_id: invoiceData.stripe_customer_id
      }
    })
    if (result.status === 201) {
      return result.data.response
    } else {
      console.log(result)
    }
  }
)

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
          sales_order_id: '',
          sales_order_code: '',
          purchase_order_id: '',
          purchase_order_code: '',
          due_date: '',
          total_due: '',
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