import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';


export const getWishlistCustomItem = createAsyncThunk('inventoryApp/wishlistcustomitem/getWishlistCustomItem',
    async (queryparams) => {
        const result = await axios.get('/itemswishlist/getitem', {
            params: {
                wishlist_item_id: queryparams.wishlist_item_id
            }
        })
        if (result.status === 200) {
            return result.data.response
        } else {
            console.log(result)
        }
    });

export const updateWishlistCustomItemStatus = createAsyncThunk('inventoryApp/wishlistcustomitem/updateWishlistCustomItemStatus',
    async (new_updated_status_data, { dispatch, getState }) => {

    }
);

export const saveWishlistCustomItem = createAsyncThunk('inventoryApp/wishlistcustomitem/saveWishlistCustomItem',
    async (wishlistCustomItemData, { dispatch, getState }) => {
        const result = await axios.post('/itemswishlist/addcustomitem', {
            item_name: wishlistCustomItemData.data.item_name,
            unit: wishlistCustomItemData.data.unit,
            rate: wishlistCustomItemData.data.rate,
            images: wishlistCustomItemData.data.images,
            featuredImageId: wishlistCustomItemData.data.featuredImageId
        }, {
            params: {
                tenant_id: wishlistCustomItemData.org_id
            }
        })
        if (result.status === 200) {
            dispatch(showMessage({ message: result.data.message, variant: "success" }))
            return result.data.response
        } else {
            console.log(result)
        }
    }
);

const wishlistcustomitemSlice = createSlice({
    name: 'inventoryApp/wishlistcustomitem',
    initialState: null,
    reducers: {
        resetWishlistCustomItem: () => null,
        newWishlistCustomItem: {
            reducer: (state, action) => action.payload,
            prepare: (event) => ({
                payload: {
                    item_name: '',
                    rate: '',
                    unit: '',
                    images: [],
                    featuredImageId: ''
                },
            }),
        },
    },
    extraReducers: {
        [getWishlistCustomItem.fulfilled]: (state, action) => action.payload,
        [saveWishlistCustomItem.fulfilled]: (state, action) => action.payload,
        [updateWishlistCustomItemStatus.fulfilled]: (state, action) => null,
    },
});

export const { newWishlistCustomItem, resetWishlistCustomItem } = wishlistcustomitemSlice.actions;

export const selectWishlistCustomItem = ({ inventoryApp }) => inventoryApp.wishlistcustomitem;

export default wishlistcustomitemSlice.reducer;
