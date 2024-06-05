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
                item_code: updatedData.item_code,
                platform_sku: updatedData.platform_sku
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
    async (updated_value, { dispatch, getState }) => {
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
                dispatch(showMessage({ message: "Stock Updated!", variant: "success" }))
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

        const result = await axios.post('/itemswishlist/additem', wishlistItemData.data, {
            params: {
                tenant_id: wishlistItemData.tenant_id
            }
        })

        if (result.status === 201) {

            dispatch(showMessage({ message: result.data.message, variant: "success" }))
            return result.data.response

        } else {

            console.log(result)

        }

    });

const wishlistitemSlice = createSlice({
    name: 'inventoryApp/wishlistitem',
    initialState: null,
    reducers: {
        resetWishlistItem: () => null,
        newWishlistItem: {
            reducer: (state, action) => action.payload,
            prepare: (event, role) =>
            (
                {
                    payload: {
                        item_id: event.item_id,
                        item_code: event.item_code,
                        item_name: event.item_name,
                        description: event.description,
                        rate: role === 'retailer' ? event.rate : 0,
                        purchase_rate: role === 'retailer' ? event.purchase_rate : 0,
                        unit: event.unit,
                        is_taxable: role === 'retailer' ? event.is_taxable : false,
                        tax_id: role === 'retailer' ? event.tax_id : "",
                        images: event.images,
                        featuredImageId: event.featuredImageId,
                        sku: role === 'retailer' ? event.sku : "",
                        platform_sku: event.sku,
                        upc: role === 'retailer' ? event.upc : "",
                        ean: role === 'retailer' ? event.ean : "",
                        isbn: role === 'retailer' ? event.isbn : "",
                        asinno: role === 'retailer' ? event.asinno : "",
                        part_number: role === 'retailer' ? event.part_number : "",
                        item_tax_preference: role === 'retailer' ? event.item_tax_preference : [],
                        hsn_or_sac: role === 'retailer' ? event.hsn_or_sac : "",
                        sat_item_key_code: role === 'retailer' ? event.sat_item_key_code : "",
                        unitkey_code: role === 'retailer' ? event.unitkey_code : "",
                        quantity: 0,
                        status: true
                    },
                }
            ),
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
