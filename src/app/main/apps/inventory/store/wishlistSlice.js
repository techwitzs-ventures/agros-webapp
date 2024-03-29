import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';


export const getWishlistItem = createAsyncThunk('inventoryApp/wishlistitem/getWishlistItem',
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

export const updateWishlistItemStatus = createAsyncThunk('inventoryApp/wishlistitem/updateWishlistItemStatus',
    async (updatedData, { dispatch, getState }) => {
        try {
            const result = await axios.put('/itemswishlist/updatestatus', {
                status: updatedData.status,
                item_id: updatedData.item_id,
                item_code: updatedData.item_code
            }, {
                params: {
                    tenant_id: updatedData.tenant_id,
                    items_wishlist_id: updatedData.items_wishlist_id
                }
            })
            if (result.status === 200) {
                return result.data.response
            } else {
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }
);

export const updateWishlistItemQuantity = createAsyncThunk('inventoryApp/wishlistitem/updatequantity',
    async (updated_value) => {
        try {
            const result = await axios.put('/itemswishlist/updatequantity', {
                quantity: updated_value.quantity
            }, {
                params: {
                    tenant_id: updated_value.tenant_id,
                    items_wishlist_id: updated_value.items_wishlist_id
                }
            })
            if (result.status === 200) {
                console.log(result.data)
                return result.data
            } else {
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }
)

export const saveWishlistItem = createAsyncThunk('inventoryApp/wishlistitem/saveWishlistItem',
    async (wishlistItemData, { dispatch, getState }) => {
        const result = await axios.post('/itemswishlist/additem', {
            item_id: wishlistItemData.data.item_id,
            item_code: wishlistItemData.data.item_code,
            item_name: wishlistItemData.data.item_name,
            unit: wishlistItemData.data.unit,
            rate: wishlistItemData.data.rate,
            images: wishlistItemData.data.images,
            featuredImageId: wishlistItemData.data.featuredImageId
        }, {
            params: {
                tenant_id: wishlistItemData.org_id
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

const wishlistitemSlice = createSlice({
    name: 'inventoryApp/wishlistitem',
    initialState: null,
    reducers: {
        resetWishlistItem: () => null,
        newWishlistItem: {
            reducer: (state, action) => action.payload,
            prepare: (event) => ({
                payload: {
                    item_id: event.item_id,
                    item_code: event.item_code,
                    item_name: event.item_name,
                    rate: event.rate,
                    unit: event.unit,
                    images: event.images,
                    featuredImageId: event.featuredImageId
                },
            }),
        },
    },
    extraReducers: {
        [getWishlistItem.fulfilled]: (state, action) => action.payload,
        [saveWishlistItem.fulfilled]: (state, action) => action.payload,
        [updateWishlistItemStatus.fulfilled]: (state, action) => null,
        [updateWishlistItemQuantity.fulfilled]: (state, action) => null
    },
});

export const { newWishlistItem, resetWishlistItem } = wishlistitemSlice.actions;

export const selectWishlistItem = ({ inventoryApp }) => inventoryApp.wishlistitem;

export default wishlistitemSlice.reducer;
