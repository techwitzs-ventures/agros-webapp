import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const getCustomers = createAsyncThunk('customersApp/customers/getCustomers', async (get_customers_obj) => {
  try {

    const result = await axios.get('/customer/customersbytenantid', {
      params: {
        tenant_id: get_customers_obj.tenant_id
      }
    })
    
    return result.data.response

  } catch (error) {
    console.log(error)
  }
});

export const removeCustomers = createAsyncThunk('customersApp/customers', async () => {

}
);

const customersAdapter = createEntityAdapter({});

export const { selectAll: selectCustomers, selectById: selectProductById } =
  customersAdapter.getSelectors((state) => state.customersApp.customers);

const customersSlice = createSlice({
  name: 'customersApp/customers',
  initialState: customersAdapter.getInitialState({
    searchText: ''
  }),
  reducers: {
    setCustomersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getCustomers.fulfilled]: customersAdapter.setAll,
    [removeCustomers.fulfilled]: (state, action) =>
      customersAdapter.removeMany(state, action.payload),
  },
});

export const { setCustomersSearchText } = customersSlice.actions;

export const selectCustomersSearchText = ({ customersApp }) => customersApp.customers.searchText;


export default customersSlice.reducer;
