/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';
import axios from 'axios';

export const getAllInvoice = createAsyncThunk('invoices/getAllInvoice', async (items, { dispatch, getState }) => {
    const result = await axios.get('/invoice/getallinvoices');
    return result.data.response;
});


const invoiceSlice = createSlice({
    name: 'invoices',
    initialState: [],
    reducers: {
        resetInvoiceList: () => [],
    },
    extraReducers: {
        [getAllInvoice.fulfilled]: (state, action) => action.payload,
    },
});

export const { resetInvoiceList } = invoiceSlice.actions;

export const selectAllinvoices = (state) => state.invoices;

export default invoiceSlice.reducer;
