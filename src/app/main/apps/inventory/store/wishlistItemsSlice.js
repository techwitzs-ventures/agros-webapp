import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const getWishlistItems = createAsyncThunk('inventoryApp/wishlistitems/getWishlistItems', async (get_wishlistitems_obj) => {
  const result = await axios.get('/itemswishlist/getitemsbyorgid', { params: get_wishlistitems_obj })
  return result.data.response
});

export const removeWishlistItems = createAsyncThunk(
  'inventoryApp/wishlistitems', () => {

  }
);

const wishlistitemsAdapter = createEntityAdapter({});

export const { selectAll: selectWishlistItems, selectById: selectProductById } =
  wishlistitemsAdapter.getSelectors((state) => state.inventoryApp.wishlistitems);

const wishlistitemsSlice = createSlice({
  name: 'inventoryApp/wishlistitems',
  initialState: wishlistitemsAdapter.getInitialState({
    searchText: '',
    activeStatus: false
  }),
  reducers: {
    setWishlistItemsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    setWishlistItemsActiveStatus: {
      reducer: (state, action) => {
        state.activeStatus = action.payload;
      },
      prepare: (event) => ({ payload: event.target.checked }),
    },
  },
  extraReducers: {
    [getWishlistItems.fulfilled]: wishlistitemsAdapter.setAll,
    [removeWishlistItems.fulfilled]: (state, action) =>
      wishlistitemsAdapter.removeMany(state, action.payload),
  },
});

export const { setWishlistItemsSearchText, setWishlistItemsActiveStatus } = wishlistitemsSlice.actions;

export const selectWishlistItemsSearchText = ({ inventoryApp }) => inventoryApp.wishlistitems.searchText;
export const selectWishlistItemsActiveStatus = ({ inventoryApp }) => inventoryApp.wishlistitems.activeStatus;


export default wishlistitemsSlice.reducer;
