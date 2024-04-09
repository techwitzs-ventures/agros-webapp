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

export const updateWishlistCustomItem = createAsyncThunk('inventoryApp/wishlistcustomitem/updateWishlistCustomItem',
    async (updated_data, { dispatch, getState }) => {
        try {
            const result = await axios.put('/itemswishlist/updatecustomitem', {
                item_name: updated_data.item_name,
                unit: updated_data.unit,
                rate: updated_data.rate,
                images: updated_data.images,
                featuredImageId: updated_data.featuredImageId,
                quantity: updated_data.quantity
            }, {
                params: {
                    tenant_id: updated_data.tenant_id,
                    items_wishlist_id: updated_data.items_wishlist_id
                }
            })
            if (result.status === 200) {
                dispatch(showMessage({ message: "Item Updated Successfully!", variant: "success" }))
                return result.data
            } else {
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }
);

export const saveWishlistCustomItem = createAsyncThunk('inventoryApp/wishlistcustomitem/saveWishlistCustomItem',
    async (wishlistCustomItemData, { dispatch, getState }) => {
        const result = await axios.post('/itemswishlist/addcustomitem', {
            item_name: wishlistCustomItemData.data.item_name,
            unit: wishlistCustomItemData.data.unit,
            rate: wishlistCustomItemData.data.rate,
            images: wishlistCustomItemData.data.images,
            featuredImageId: wishlistCustomItemData.data.featuredImageId,
            quantity: wishlistCustomItemData.data.quantity
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
                    item_name: event.item_name,
                    rate: '',
                    unit: '',
                    images: [],
                    featuredImageId: '',
                    quantity: 0
                },
            }),
        },
    },
    extraReducers: {
        [getWishlistCustomItem.fulfilled]: (state, action) => action.payload,
        [saveWishlistCustomItem.fulfilled]: (state, action) => action.payload,
        [updateWishlistCustomItem.fulfilled]: (state, action) => null,
    },
});

export const { newWishlistCustomItem, resetWishlistCustomItem } = wishlistcustomitemSlice.actions;

export const selectWishlistCustomItem = ({ inventoryApp }) => inventoryApp.wishlistcustomitem;

export default wishlistcustomitemSlice.reducer;
