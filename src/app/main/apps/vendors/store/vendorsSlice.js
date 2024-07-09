import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const getVendors = createAsyncThunk('vendorsApp/vendors/getVendors',
  async (get_vendors_obj) => {
    try {

      const result = await axios.get('/vendor/vendorsbytenantid', {
        params: {
          tenant_id: get_vendors_obj.tenant_id
        }
      })
      return result.data.response

    } catch (error) {
      console.log(error)
    }
  });

export const removeVendors = createAsyncThunk('vendorsApp/vendors/removeVendors',
  async () => {

  }
);

const vendorsAdapter = createEntityAdapter({});

export const { selectAll: selectVendors, selectById: selectProductById } =
  vendorsAdapter.getSelectors((state) => state.vendorsApp.vendors);

const vendorsSlice = createSlice({
  name: 'vendorsApp/vendors',
  initialState: vendorsAdapter.getInitialState({
    searchText: ''
  }),
  reducers: {
    setVendorsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getVendors.fulfilled]: vendorsAdapter.setAll,
    [removeVendors.fulfilled]: (state, action) =>
      vendorsAdapter.removeMany(state, action.payload),
  },
});

export const { setVendorsSearchText } = vendorsSlice.actions;

export const selectVendorsSearchText = ({ vendorsApp }) => vendorsApp.vendors.searchText;


export default vendorsSlice.reducer;
