/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';
import axios from 'axios'

export const getAllTenant = createAsyncThunk('tenant/getalltenant', 
async (tenant, { dispatch, getState }) => {
    const result = await axios.get('/onboarding/getalltenant');
    return result.data.response;
});


const tenantSlice = createSlice({
    name: 'tenant',
    initialState: [],
    reducers: {
        resetTenantList: () => [],
    },
    extraReducers: {
        [getAllTenant.fulfilled]: (state, action) => action.payload,
    },
});

export const { resetTenantList } = tenantSlice.actions;

export const selectTenant = (state) => state.tenant;

export default tenantSlice.reducer;
