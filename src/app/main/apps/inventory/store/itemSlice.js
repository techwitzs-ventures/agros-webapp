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

export const putCustomItem = createAsyncThunk('inventoryApp/item/putCustomItem',

  async (item_details) => {
    return {
      items_cat_id: '',
      items_cat_name: '',
      item_name: item_details.item_name,
      item_type: item_details.item_type,
      product_type: item_details.product_type,
      description: item_details.description,
      rate: item_details.rate,
      purchase_rate: item_details.purchase_rate,
      unit: item_details.unit,
      is_taxable: item_details.is_taxable,
      tax_id: item_details.tax_id,
      images: item_details.images,
      featuredImageId: item_details.featuredImageId,
      sku: '',
      upc: item_details.upc,
      ean: item_details.ean,
      isbn: item_details.isbn,
      asinno: item_details.asinno,
      part_number: item_details.part_number,
      item_tax_preference: item_details.item_tax_preference,
      hsn_or_sac: item_details.hsn_or_sac,
      sat_item_key_code: item_details.sat_item_key_code,
      unitkey_code: item_details.unitkey_code
    };
  })

export const updateItem = createAsyncThunk('inventoryApp/item/updateItem',

  async (updatedItemData, { dispatch, getState }) => {

    try {

      const result = await axios.put('/item/updateitem', {
        items_cat_name: updatedItemData.items_cat_name,
        item_name: updatedItemData.item_name,
        item_type: updatedItemData.item_type,
        product_type: updatedItemData.product_type,
        description: updatedItemData.description,
        rate: updatedItemData.rate,
        purchase_rate: updatedItemData.purchase_rate,
        unit: updatedItemData.unit,
        is_taxable: updatedItemData.is_taxable,
        tax_id: updatedItemData.tax_id,
        images: updatedItemData.images,
        featuredImageId: updatedItemData.featuredImageId,
        sku: updatedItemData.sku,
        upc: updatedItemData.upc,
        ean: updatedItemData.ean,
        isbn: updatedItemData.isbn,
        asinno: updatedItemData.asinno,
        part_number: updatedItemData.part_number,
        item_tax_preference: updatedItemData.item_tax_preference,
        hsn_or_sac: updatedItemData.hsn_or_sac,
        sat_item_key_code: updatedItemData.sat_item_key_code,
        unitkey_code: updatedItemData.unitkey_code
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

    } catch (error) {

      console.log(error);

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

  });

export const saveItem = createAsyncThunk('inventoryApp/item/saveItem',

  async (itemData, { dispatch, getState }) => {

    const result = await axios.post('/item/additem', itemData.data, {
      params: {
        tenant_id: itemData.tenant_id
      }
    })

    if (result.status === 201) {

      dispatch(showMessage({ message: result.data.message, variant: "success" }));
      return result.data.response

    } else {

      console.log(result)

    }

  });

const itemSlice = createSlice({
  name: 'inventoryApp/item',
  initialState: null,
  reducers: {
    resetItem: () => null,
    newItem: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          items_cat_id: '',
          items_cat_name: '',
          item_name: '',
          item_type: 'inventory',
          product_type: 'goods',
          description: '',
          rate: 0,
          purchase_rate: 0,
          unit: '',
          is_taxable: false,
          tax_id: '',
          images: [],
          featuredImageId: '',
          sku: '',
          upc: 0,
          ean: 0,
          isbn: '',
          asinno: '',
          part_number: '',
          item_tax_preference: [],
          hsn_or_sac: '',
          sat_item_key_code: '',
          unitkey_code: ''
        },
      }),
    },
  },
  extraReducers: {
    [getItem.fulfilled]: (state, action) => action.payload,
    [putCustomItem.fulfilled]: (state, action) => action.payload,
    [saveItem.fulfilled]: (state, action) => action.payload,
    [updateItemStatus.fulfilled]: (state, action) => null,
  },
});

export const { newItem, resetItem } = itemSlice.actions;

export const selectItem = ({ inventoryApp }) => inventoryApp.item;

export default itemSlice.reducer;
