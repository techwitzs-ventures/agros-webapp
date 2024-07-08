import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';


export const getVendor = createAsyncThunk('vendorsApp/vendor/getVendor',

    async (queryparams) => {
        try {

        } catch (error) {

            console.log(error)

        }

    });



export const saveVendor = createAsyncThunk('vendorsApp/vendor/saveVendor',

    async (vendorData, { dispatch, getState }) => {
        console.log(vendorData)
        // const body = {
        //     email: vendorData.data.email,
        //     name: vendorData.data.name,
        //     phone: `${vendorData.data.countrycode}${vendorData.data.phone}`
        // }
        // try {
        //     const result = await axios.post('/vendor/add_vendor', body, {
        //         params: {
        //             vendor_id: vendorData.tenant_id,
        //             stripe_account_id: vendorData.stripe_account_id
        //         }
        //     })

        //     if (result.status === 201) {
        //         dispatch(showMessage({ message: result.data.message, variant: "success" }));
        //         return result.data.response
        //     }
        // } catch (error) {
        //     console.log(error)
        // }

    });

const vendorSlice = createSlice({
    name: 'vendorsApp/vendor',
    initialState: null,
    reducers: {
        resetVendor: () => null,
        newVendor: {
            reducer: (state, action) => action.payload,
            prepare: (event) => ({
                payload: {
                    email: "",
                    mobilenumber: "",
                    firstname: "",
                    lastname: ""
                },
            }),
        },
    },
    extraReducers: {
        [getVendor.fulfilled]: (state, action) => action.payload,
        [saveVendor.fulfilled]: (state, action) => action.payload,
    },
});

export const { newVendor, resetVendor } = vendorSlice.actions;

export const selectVendor = ({ vendorsApp }) => vendorsApp.vendor;

export default vendorSlice.reducer;
