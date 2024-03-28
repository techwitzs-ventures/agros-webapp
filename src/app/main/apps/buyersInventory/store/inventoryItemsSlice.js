import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'

const getInventoryItemsList = createAsyncThunk("buyersInventoryApp/buyersinventory/getInventoryItems",
    async () => {
      return [];
    })

const buyersinventoryAdaptor = createEntityAdapter({})

export const { selectAll: selectBuyersInventoryItems, selectById: selectProductById } =
    buyersinventoryAdaptor.getSelectors((state) => state.buyersInventoryApp.buyersinventory)

const buyersinventorySlice = createSlice({
    name: "buyersInventoryApp/buyersinventory",
    initialState: buyersinventoryAdaptor.getInitialState({
        searchText: ""
    }),
    reducers: {
        setBuyersInventoryItemsSearchText: {
            reducer: (state, action) => {
                state.searchText = action.payload
            },
            prepare: (event) => ({ payload: event.target.value || "" })
        }
    },
    extraReducers: {
        [getInventoryItemsList.fulfilled]: buyersinventoryAdaptor.setAll
    }
})

export const selectBuyerInventoryItemsSearchText = ({ buyersInventoryApp }) => buyersInventoryApp.buyersinventory.searchText;

export const { setBuyersInventoryItemsSearchText } = buyersinventorySlice.actions

export default buyersinventorySlice.reducer;