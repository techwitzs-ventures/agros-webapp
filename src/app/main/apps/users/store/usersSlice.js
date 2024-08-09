import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import JwtService from '../../accounts/auth/services/jwtService';


export const getUsers = createAsyncThunk('usersApp/users/getUsers',
  async (get_users_obj) => {
    try {
      const data = await JwtService.getUsersByTenantId(get_users_obj.tenant_id);
      if (data) {
        return data
      } else {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  });

export const removeUsers = createAsyncThunk('usersApp/users/removeUsers',
  async () => {

  }
);

const usersAdapter = createEntityAdapter({});

export const { selectAll: selectUsers, selectById: selectProductById } =
  usersAdapter.getSelectors((state) => state.usersApp.users);

const usersSlice = createSlice({
  name: 'usersApp/users',
  initialState: usersAdapter.getInitialState({
    searchText: ''
  }),
  reducers: {
    setUsersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getUsers.fulfilled]: usersAdapter.setAll,
    [removeUsers.fulfilled]: (state, action) =>
      usersAdapter.removeMany(state, action.payload),
  },
});

export const { setUsersSearchText } = usersSlice.actions;

export const selectUsersSearchText = ({ usersApp }) => usersApp.users.searchText;


export default usersSlice.reducer;
