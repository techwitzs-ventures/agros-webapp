import { createSlice } from "@reduxjs/toolkit";


const salesordersSlice = createSlice({
    name: "soDetailsApp/soitems",
    initialState: [],
    reducers: {
        setItemsForSalesOrders: {
            reducer: (state, action) => action.payload,
            prepare: (event) => ({ payload: event }),
        }
    }
});

export const { setItemsForSalesOrders } = salesordersSlice.actions;

export const selectItemsForSalesOrders = ({ soDetailsApp }) => soDetailsApp.soitems;

export default salesordersSlice.reducer;
