/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';
import axios from 'axios';

export const getAllItemsCategories = createAsyncThunk(
    'itemscategories/getallitemscategories',
    async (itemscategories, { dispatch, getState }) => {
        const result = await axios.get('/itemscategeory/getallitemscategory');
        return result.data.response
    });


const itemscategoriesSlice = createSlice({
    name: 'itemscategories',
    initialState: [],
    reducers: {
        resetItemsCategoriesList: () => [],
    },
    extraReducers: {
        [getAllItemsCategories.fulfilled]: (state, action) => action.payload,
    },
});

export const { resetItemsCategoriesList } = itemscategoriesSlice.actions;

export const selectAllItemsCategories = (state) => state.itemscategories;

export default itemscategoriesSlice.reducer;
