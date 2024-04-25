import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { saveItemsCategory, updateItemCategory, updateItemsCategoryStatus } from './itemsCategorySlice';


export const getItemsCategories = createAsyncThunk('inventoryApp/itemscategories/getItemsCategories',
  async (get_items_cat_obj) => {
    const result = await axios.get('/itemscategory/getitemscatlist', { params: get_items_cat_obj })
    return result.data.response
  });

export const removeItemsCategories = createAsyncThunk(
  'inventoryApp/itemscategories',
  () => {

  }
);

const itemsCategoriesAdapter = createEntityAdapter({});

export const { selectAll: selectItemsCategories, selectById: selectProductById } =
  itemsCategoriesAdapter.getSelectors((state) => state.inventoryApp.itemscategories);

const itemsCategoriesSlice = createSlice({
  name: 'inventoryApp/itemscategories',
  initialState: itemsCategoriesAdapter.getInitialState({
    searchText: '',
    activeStatus: false
  }),
  reducers: {
    setItemsCategoriesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    setItemsCategoriesActiveStatus: {
      reducer: (state, action) => {
        state.activeStatus = action.payload;
      },
      prepare: (event) => ({ payload: event.target.checked }),
    },
  },
  extraReducers: {
    [getItemsCategories.fulfilled]: itemsCategoriesAdapter.setAll,
    [updateItemCategory.fulfilled]: itemsCategoriesAdapter.upsertOne,
    [updateItemsCategoryStatus.fulfilled]: itemsCategoriesAdapter.upsertOne,
    [saveItemsCategory.fulfilled]: itemsCategoriesAdapter.addOne,
    [removeItemsCategories.fulfilled]: (state, action) =>
      itemsCategoriesAdapter.removeMany(state, action.payload),
  },
});

export const { setItemsCategoriesSearchText, setItemsCategoriesActiveStatus } = itemsCategoriesSlice.actions;

export const selectItemsCategoriesSearchText = ({ inventoryApp }) => inventoryApp.itemscategories.searchText;
export const selectItemsCategoriesActiveStatus = ({ inventoryApp }) => inventoryApp.itemscategories.activeStatus;


export default itemsCategoriesSlice.reducer;