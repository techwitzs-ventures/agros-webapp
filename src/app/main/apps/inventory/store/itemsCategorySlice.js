import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';

export const getItemsCategory = createAsyncThunk('inventoryApp/itemscategory/getItemsCategory',
  async (queryparams) => {
    try {
      const result = await axios.get('/itemscategory/getitemscategory', { params: queryparams })
      return result.data.response
    } catch (error) {
      console.log(error)
    }
  });

export const updateItemCategory = createAsyncThunk('inventoryApp/itemscategory/updateItemsCategory',
  async (updatedItemsCategoryData, { dispatch, getState }) => {
    const result = await axios.put('/itemscategory/updatecategory', {
      items_cat_name: updatedItemsCategoryData.items_cat_name,
    }, {
      params: {
        tenant_id: updatedItemsCategoryData.tenant_id,
        items_cat_id: updatedItemsCategoryData.items_cat_id,
      }
    })
    if (result.status === 200) {
      dispatch(showMessage({ message: result.data.message, variant: "success" }))
      return result.data.response
    } else {
      console.log(result);
    }
  })

export const updateItemsCategoryStatus = createAsyncThunk('inventoryApp/itemscategory/updateItemsCategoryStatus',
  async (new_updated_status_data, { dispatch, getState }) => {
    try {
      const result = await axios.put('/itemscategory/updatestatus', {
        status: new_updated_status_data.status
      }, {
        params: {
          tenant_id: new_updated_status_data.queryparams.tenant_id,
          items_cat_id: new_updated_status_data.queryparams.items_cat_id,
        }
      })
      if (result.status === 200) {
        dispatch(showMessage({ message: "Status Updated Successfully", variant: "success" }))
        return result.data.response
      } else {
        console.log(response)
      }
    } catch (error) {
      console.log(error)
    }
  }
);

export const saveItemsCategory = createAsyncThunk('inventoryApp/itemscategory/saveItemsCategory',
  async (itemCategoryData, { dispatch, getState }) => {
    const result = await axios.post('/itemscategory/addcategory', {
      items_cat_name: itemCategoryData.data.items_cat_name,
    }, {
      params: {
        tenant_id: itemCategoryData.tenant_id
      }
    })
    if (result.status === 200) {
      dispatch(showMessage({ message: result.data.message, variant: "success" }));
      return result.data.response
    } else {
      console.log(result)
    }
  }
);

const itemsCategorySlice = createSlice({
  name: 'inventoryApp/itemscategory',
  initialState: null,
  reducers: {
    resetItemsCategory: () => null,
    newItemsCategory: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          items_cat_name: ""
        },
      }),
    },
  },
  extraReducers: {
    [getItemsCategory.fulfilled]: (state, action) => action.payload,
    [saveItemsCategory.fulfilled]: (state, action) => action.payload,
    [updateItemsCategoryStatus.fulfilled]: (state, action) => null,
  },
});

export const { newItemsCategory, resetItemsCategory } = itemsCategorySlice.actions;

export const selectItemsCategory = ({ inventoryApp }) => inventoryApp.itemscategory;

export default itemsCategorySlice.reducer;
