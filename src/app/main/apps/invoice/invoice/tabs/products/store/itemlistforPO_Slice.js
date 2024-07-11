import { createSlice } from "@reduxjs/toolkit";


const purchaseordersSlice = createSlice({
    name: "poDetailsApp/poitems",
    initialState: [],
    reducers: {
        setItemsForPurchaseOrders: {
            reducer: (state, action) => action.payload,
            prepare: (event) => ({ payload: event }),
        }
    }
});

export const { setItemsForPurchaseOrders } = purchaseordersSlice.actions;

export const selectItemsForPurchaseOrders = ({ poDetailsApp }) => poDetailsApp.poitems;

export default purchaseordersSlice.reducer;
