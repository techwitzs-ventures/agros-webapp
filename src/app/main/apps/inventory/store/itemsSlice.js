import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const getItems = createAsyncThunk('inventoryApp/items/getItems', async (get_items_obj) => {
  const result = await axios.get('/item/getitems', { params: get_items_obj })
  return result.data.response
});

export const removeItems = createAsyncThunk(
  'inventoryApp/items', () => {

  }
);

const itemsAdapter = createEntityAdapter({});

export const { selectAll: selectItems, selectById: selectProductById } =
  itemsAdapter.getSelectors((state) => state.inventoryApp.items);

const itemsSlice = createSlice({
  name: 'inventoryApp/items',
  initialState: itemsAdapter.getInitialState({
    searchText: '',
    activeStatus: false
  }),
  reducers: {
    setItemsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    setItemsActiveStatus: {
      reducer: (state, action) => {
        state.activeStatus = action.payload;
      },
      prepare: (event) => ({ payload: event.target.checked }),
    },
  },
  extraReducers: {
    [getItems.fulfilled]: itemsAdapter.setAll,
    [removeItems.fulfilled]: (state, action) =>
      itemsAdapter.removeMany(state, action.payload),
  },
});

export const { setItemsSearchText, setItemsActiveStatus } = itemsSlice.actions;

export const selectItemsSearchText = ({ inventoryApp }) => inventoryApp.items.searchText;
export const selectItemsActiveStatus = ({ inventoryApp }) => inventoryApp.items.activeStatus;


export default itemsSlice.reducer;
