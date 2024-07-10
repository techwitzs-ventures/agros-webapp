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
                description: updated_data.description,
                purchase_rate: updated_data.purchase_rate,
                selling_rate: updated_data.selling_rate,
                unit: updated_data.unit,
                is_taxable: updated_data.is_taxable,
                tax_id: updated_data.tax_id,
                images: updated_data.images,
                featuredImageId: updated_data.featuredImageId,
                sku: updated_data.sku,
                upc: updated_data.upc,
                ean: updated_data.ean,
                isbn: updated_data.isbn,
                asinno: updated_data.asinno,
                part_number: updated_data.part_number,
                item_tax_preference: updated_data.item_tax_preference,
                hsn_or_sac: updated_data.hsn_or_sac,
                sat_item_key_code: updated_data.sat_item_key_code,
                unitkey_code: updated_data.unitkey_code,
                quantity: updated_data.quantity,
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

    });

export const saveWishlistCustomItem = createAsyncThunk('inventoryApp/wishlistcustomitem/saveWishlistCustomItem',

    async (wishlistCustomItemData, { dispatch, getState }) => {

        const result = await axios.post('/itemswishlist/additem', wishlistCustomItemData.data, {
            params: {
                tenant_id: wishlistCustomItemData.tenant_id
            }
        })

        if (result.status === 201 || result.status === 200) {

            dispatch(showMessage({ message: result.data.message, variant: "success" }))
            return result.data.response

        } else {

            console.log(result)

        }

    });

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
                    description: '',
                    purchase_rate: 0,
                    selling_rate: 0,
                    unit: '',
                    is_taxable: false,
                    tax_id: "",
                    images: [],
                    featuredImageId: '',
                    sku: "",
                    upc: "",
                    ean: "",
                    isbn: "",
                    asinno: "",
                    part_number: "",
                    item_tax_preference: [],
                    hsn_or_sac: "",
                    sat_item_key_code: "",
                    unitkey_code: "",
                    quantity: 0,
                    status: false
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
