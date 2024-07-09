import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';


export const getVendor = createAsyncThunk('vendorsApp/vendor/getVendor',

    async (queryparams, { dispatch, getState }) => {

        try {
            const result = await axios.get(
                '/vendor/getvendor',
                {
                    params: {
                        vendor_id: queryparams.vendor_id
                    }
                }
            );

            return {
                email: result.data.response.email,
                mobilenumber: result.data.response.mobilenumber.slice(3),
                countrycode: result.data.response.mobilenumber.slice(0, 3),
                firstname: result.data.response.firstname,
                lastname: result.data.response.lastname
            }

        } catch (error) {

            console.log(error)

        }

    });

export const getVendorByEmail = createAsyncThunk('vendorsApp/vendor/getVendorByEmail',
    async (email, { dispatch, getState }) => {
        try {
            const result = await axios.get(
                '/vendor/vendorsbyemail',
                {
                    params: {
                        email
                    }
                }
            );
            if (result.status === 200) {
                if (result.data.response.length > 0) {
                    return true
                } else {
                    return false
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
)

export const saveVendor = createAsyncThunk('vendorsApp/vendor/saveVendor',

    async (vendorData, { dispatch, getState }) => {

        const body = {
            email: vendorData.data.email,
            mobilenumber: `${vendorData.data.countrycode}${vendorData.data.mobilenumber}`,
            firstname: vendorData.data.firstname,
            lastname: vendorData.data.lastname
        }
        try {
            const result = await axios.post(
                '/vendor/create_vendor',
                body,
                {
                    params: {
                        tenant_id: vendorData.tenant_id,
                    }
                }
            )
            if (result.status === 201) {
                dispatch(showMessage({ message: result.data.message, variant: "success" }));
                return result.data.response
            }

        } catch (error) {
            console.log(error)
        }

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
