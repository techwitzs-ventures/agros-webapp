import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

export const getVendorList = createAsyncThunk("orderApp/vendorlist/getVendorList",
    async (org_id) => {
        try {
            const result = await axios.get('/purchaseorder/getvendorlist', {
                params: {
                    tenant_id: org_id
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
)

export const getTenant = createAsyncThunk('orderApp/vendorlist/getTenant',
    async (org_id) => {
        try {
            const result = await axios.get('/tenant/gettenant', {
                params: {
                    tenant_id: org_id
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
)

const vendorlistAdapter = createEntityAdapter({});

export const { selectAll: selectVendorList,
    selectById: selectProductById } = vendorlistAdapter.getSelectors((state) => state.orderApp.vendorlist);

const vendorlistSlice = createSlice({
    name: "orderApp/vendorlist",
    initialState: vendorlistAdapter.getInitialState({}),
    reducers: {
        resetVendorList: () => null
    },
    extraReducers: {
        [getVendorList.fulfilled]: vendorlistAdapter.setAll
    },
});

export const { resetVendorList } = vendorlistSlice.actions;


export default vendorlistSlice.reducer;
