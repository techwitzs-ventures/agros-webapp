/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';
import axios from 'axios';

export const getAllPurchaseOrders = createAsyncThunk('purchaseorders/getAllPurchaseOrders',
 async (items, { dispatch, getState }) => {
    const result = await axios.get('/purchaseorder/getallpurchaseorders');
    return result.data.response;
});


const purchaseOrderSlice = createSlice({
    name: 'purchaseorders',
    initialState: [],
    reducers: {
        resetPurchaseOrderList: () => [],
    },
    extraReducers: {
        [getAllPurchaseOrders.fulfilled]: (state, action) => action.payload,
    },
});

export const { resetPurchaseOrderList } = purchaseOrderSlice.actions;

export const selectAllPurchaseOrders = (state) => state.purchaseorders;

export default purchaseOrderSlice.reducer;
