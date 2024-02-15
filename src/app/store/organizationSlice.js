/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';
import axios from 'axios'

export const getAllOrganization = createAsyncThunk('orgainzation/getallorganization', 
async (organization, { dispatch, getState }) => {
    const result = await axios.get('/organization/all');
    return result.data.response;
});


const organizationSlice = createSlice({
    name: 'organization',
    initialState: [],
    reducers: {
        resetOrganizationList: () => [],
    },
    extraReducers: {
        [getAllOrganization.fulfilled]: (state, action) => action.payload,
    },
});

export const { resetOrganizationList } = organizationSlice.actions;

export const selectOrganization = (state) => state.organization;

export default organizationSlice.reducer;
