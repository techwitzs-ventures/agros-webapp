/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';
import axios from 'axios';

export const getAllSalesOrders = createAsyncThunk('salesorders/getAllSalesOrders', async (items, { dispatch, getState }) => {
    const result = await axios.get('/salesorder/getallsalesorders');
    return result.data.response;
});


const salesorderSlice = createSlice({
    name: 'salesorders',
    initialState: [],
    reducers: {
        resetSalesOrderList: () => [],
    },
    extraReducers: {
        [getAllSalesOrders.fulfilled]: (state, action) => action.payload,
    },
});

export const { resetSalesOrderList } = salesorderSlice.actions;

export const selectAllSalesOrders = (state) => state.salesorders;

export default salesorderSlice.reducer;
