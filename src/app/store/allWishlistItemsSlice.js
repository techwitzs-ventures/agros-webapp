/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';
import axios from 'axios';

export const getAllWishlistItems = createAsyncThunk(
    'wishlistitems/getallwishlistitems',
    async (wishlistitems, { dispatch, getState }) => {
        const result = await axios.get('/itemswishlist/getallitems');
        if (result.status === 200) {
            let arr = [];
            result.data.response.forEach((item) => {
                if (!item.status) {
                    arr.push(item)
                }
            })
            return arr;
        } else {
            console.log(result)
        }
    });

const wishlistitemsAdapter = createEntityAdapter({});

export const { selectAll: selectAllWishlistItems, selectById: selectProductById } =
    wishlistitemsAdapter.getSelectors((state) => state.wishlistitems);

const wishlistitemsSlice = createSlice({
    name: 'wishlistitems',
    initialState: wishlistitemsAdapter.getInitialState({
        searchText: ''
    }),
    reducers: {
        resetWishlistItemsList: () => [],
        setAllWishlistItemsSearchText: {
            reducer: (state, action) => {
                state.searchText = action.payload;
            },
            prepare: (event) => ({ payload: event.target.value || '' }),
        }
    },
    extraReducers: {
        [getAllWishlistItems.fulfilled]: wishlistitemsAdapter.setAll,
    },
});

export const { resetWishlistItemsList, setAllWishlistItemsSearchText } = wishlistitemsSlice.actions;

export const selectAllWishlistItemsSearchText = ({ wishlistitems }) => wishlistitems.searchText;

export default wishlistitemsSlice.reducer;
