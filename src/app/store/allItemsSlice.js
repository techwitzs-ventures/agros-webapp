/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';
import axios from 'axios';

export const getAllItems = createAsyncThunk(
    'items/getallitems',
    async (items, { dispatch, getState }) => {
        const result = await axios.get('/item/getallitems');
        return result.data.response;
    });


const itemsSlice = createSlice({
    name: 'items',
    initialState: [],
    reducers: {
        resetItemsList: () => [],
    },
    extraReducers: {
        [getAllItems.fulfilled]: (state, action) => action.payload,
    },
});

export const { resetItemsList } = itemsSlice.actions;

export const selectAllItems = (state) => state.items;

export default itemsSlice.reducer;
