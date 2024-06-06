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

export const updateWishlistItem = createAsyncThunk('inventoryApp/wishlistitem/updatequantity',
    async (updated_value, { dispatch, getState }) => {
        try {

            const result = await axios.put('/itemswishlist/updateitem', {
                description: updated_value.description,
                rate: updated_value.rate,
                purchase_rate: updated_value.purchase_rate,
                is_taxable: updated_value.is_taxable,
                tax_id: updated_value.tax_id,
                sku: updated_value.sku,
                upc: updated_value.upc,
                ean: updated_value.ean,
                isbn: updated_value.isbn,
                asinno: updated_value.asinno,
                part_number: updated_value.part_number,
                item_tax_preference: updated_value.item_tax_preference,
                hsn_or_sac: updated_value.hsn_or_sac,
                sat_item_key_code: updated_value.sat_item_key_code,
                unitkey_code: updated_value.unitkey_code,
                quantity: updated_value.quantity,
            }, {
                params: {
                    tenant_id: updated_value.tenant_id,
                    items_wishlist_id: updated_value.items_wishlist_id
                }
            })

            if (result.status === 200) {

                dispatch(showMessage({ message: "Product Updated!", variant: "success" }))
                return result.data

            } else {

                console.log(result)

            }
        } catch (error) {

            console.log(error)

        }

    })

export const saveWishlistItem = createAsyncThunk('inventoryApp/wishlistitem/saveWishlistItem',

    async (wishlistItemData, { dispatch, getState }) => {

        const result = await axios.post('/itemswishlist/additem', wishlistItemData.data, {
            params: {
                tenant_id: wishlistItemData.tenant_id
            }
        })

        if (result.status === 201 || result.status === 200) {

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
            prepare: (event, user_role) =>
            (
                {
                    payload: {
                        item_id: event.item_id,
                        item_code: event.item_code,
                        item_name: event.item_name,
                        description: event.description,
                        rate: user_role === 'retailer' ? event.rate : 0,
                        purchase_rate: user_role === 'retailer' ? event.purchase_rate : 0,
                        unit: event.unit,
                        is_taxable: user_role === 'retailer' ? event.is_taxable : false,
                        tax_id: user_role === 'retailer' ? event.tax_id : "",
                        images: event.images,
                        featuredImageId: event.featuredImageId,
                        sku: user_role === 'retailer' ? event.sku : "",
                        platform_sku: user_role === 'retailer' ? event.platform_sku : event.sku,
                        upc: user_role === 'retailer' ? event.upc : "",
                        ean: user_role === 'retailer' ? event.ean : "",
                        isbn: user_role === 'retailer' ? event.isbn : "",
                        asinno: user_role === 'retailer' ? event.asinno : "",
                        part_number: user_role === 'retailer' ? event.part_number : "",
                        item_tax_preference: user_role === 'retailer' ? event.item_tax_preference : [],
                        hsn_or_sac: user_role === 'retailer' ? event.hsn_or_sac : "",
                        sat_item_key_code: user_role === 'retailer' ? event.sat_item_key_code : "",
                        unitkey_code: user_role === 'retailer' ? event.unitkey_code : "",
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
        [updateWishlistItem.fulfilled]: (state, action) => null
    },
});

export const { newWishlistItem, resetWishlistItem } = wishlistitemSlice.actions;

export const selectWishlistItem = ({ inventoryApp }) => inventoryApp.wishlistitem;

export default wishlistitemSlice.reducer;
