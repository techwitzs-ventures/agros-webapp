import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';


export const getItem = createAsyncThunk('inventoryApp/item/getItem',
  async (queryparams) => {
    try {
      const result = await axios.get('/item/getitem', { params: queryparams })
      return result.data.response
    } catch (error) {
      console.log(error)
    }
  });

export const updateItem = createAsyncThunk('inventoryApp/item/updateItem',
  async (updatedItemData, { dispatch, getState }) => {
    const result = await axios.put('/item/updateitem', {
      item_name: updatedItemData.item_name,
      rate: updatedItemData.rate,
      unit: updatedItemData.unit,
      images: updatedItemData.images,
      featuredImageId: updatedItemData.featuredImageId
    }, {
      params: {
        tenant_id: updatedItemData.tenant_id,
        items_cat_id: updatedItemData.items_cat_id,
        item_id: updatedItemData.item_id
      }
    })
    if (result.status === 200) {
      dispatch(showMessage({ message: result.data.message, variant: "success" }))
      return result.data.response
    } else {
      console.log(result);
    }
  })

export const updateItemStatus = createAsyncThunk('inventoryApp/item/updateItemStatus',
  async (new_updated_status_data, { dispatch, getState }) => {
    try {
      const result = await axios.put('/item/updatestatus', {
        status: new_updated_status_data.status
      }, {
        params: {
          tenant_id: new_updated_status_data.queryparams.tenant_id,
          items_cat_id: new_updated_status_data.queryparams.items_cat_id,
          item_id: new_updated_status_data.queryparams.item_id
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

export const saveItem = createAsyncThunk('inventoryApp/item/saveItem',
  async (itemData, { dispatch, getState }) => {
    const result = await axios.post('/item/additem', {
      item_name: itemData.data.item_name,
      rate: itemData.data.rate,
      unit: itemData.data.unit,
      images: itemData.data.images,
      featuredImageId: itemData.data.featuredImageId
    }, {
      params: {
        items_cat_id: itemData.data.items_cat_id,
        tenant_id: itemData.tenant_id
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

const itemSlice = createSlice({
  name: 'inventoryApp/item',
  initialState: null,
  reducers: {
    resetItem: () => null,
    newItem: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          item_name: '',
          rate: '',
          unit: '',
          items_cat_id: '',
          images: [],
          featuredImageId: ''
        },
      }),
    },
  },
  extraReducers: {
    [getItem.fulfilled]: (state, action) => action.payload,
    [saveItem.fulfilled]: (state, action) => action.payload,
    [updateItemStatus.fulfilled]: (state, action) => null,
  },
});

export const { newItem, resetItem } = itemSlice.actions;

export const selectItem = ({ inventoryApp }) => inventoryApp.item;

export default itemSlice.reducer;
