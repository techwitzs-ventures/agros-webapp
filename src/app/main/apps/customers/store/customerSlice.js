import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';


export const getCustomer = createAsyncThunk('customersApp/customer/getCustomer',

    async (queryparams) => {
        try {

        } catch (error) {

            console.log(error)

        }

    });



export const saveCustomer = createAsyncThunk('customersApp/customer/saveCustomer',

    async (customerData, { dispatch, getState }) => {
        const body = {
            email: customerData.data.email,
            name: customerData.data.name,
            phone: `${customerData.data.countrycode}${customerData.data.phone}`
        }
        try {
            const result = await axios.post('/customer/add_customer', body, {
                params: {
                    vendor_id: customerData.tenant_id,
                    stripe_account_id: customerData.stripe_account_id
                }
            })

            if (result.status === 201) {
                dispatch(showMessage({ message: result.data.message, variant: "success" }));
                return result.data.response
            }
        } catch (error) {
            console.log(error)
        }

    });

const customerSlice = createSlice({
    name: 'customersApp/customer',
    initialState: null,
    reducers: {
        resetCustomer: () => null,
        newCustomer: {
            reducer: (state, action) => action.payload,
            prepare: (event) => ({
                payload: {
                    email: "",
                    name: "",
                    phone: ""
                },
            }),
        },
    },
    extraReducers: {
        [getCustomer.fulfilled]: (state, action) => action.payload,
        [saveCustomer.fulfilled]: (state, action) => action.payload,
    },
});

export const { newCustomer, resetCustomer } = customerSlice.actions;

export const selectCustomer = ({ customersApp }) => customersApp.customer;

export default customerSlice.reducer;
