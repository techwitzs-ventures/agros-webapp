import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';


export const getCustomer = createAsyncThunk('customersApp/customer/getCustomer',

    async (queryparams) => {

        try {
            const result = await axios.get(
                '/customer/getcustomer',
                {
                    params: {
                        customer_id: queryparams.customer_id
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

export const getCustomerByEmail = createAsyncThunk('customersApp/customer/getCustomerByEmail',
    async (email, { dispatch, getState }) => {
        try {
            const result = await axios.get(
                '/customer/customersbyemail',
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

export const saveCustomer = createAsyncThunk('customersApp/customer/saveCustomer',

    async (customerData, { dispatch, getState }) => {

        const body = {
            email: customerData.data.email,
            mobilenumber: `${customerData.data.countrycode}${customerData.data.mobilenumber}`,
            firstname: customerData.data.firstname,
            lastname: customerData.data.lastname
        }

        try {
            const result = await axios.post(
                '/customer/create_customer',
                body,
                {
                    params: {
                        tenant_id: customerData.tenant_id,
                        stripe_account_id: customerData.stripe_account_id
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
                    mobilenumber: "",
                    firstname: "",
                    lastname: "",
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
