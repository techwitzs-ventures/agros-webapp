import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';


export const getUser = createAsyncThunk('usersApp/user/getUser',

    async (queryparams, { dispatch, getState }) => {

        try {
            const result = await axios.get(
                '/user/getuser',
                {
                    params: {
                        user_id: queryparams.user_id
                    }
                }
            );

            return {
                email: result.data.response.email,
                mobilenumber: result.data.response.mobilenumber.slice(3),
                countrycode: result.data.response.mobilenumber.slice(0, 3),
                firstname: result.data.response.firstname,
                lastname: result.data.response.lastname
            }

        } catch (error) {

            console.log(error)

        }

    });

export const getUserByEmail = createAsyncThunk('usersApp/user/getUserByEmail',
    async (email, { dispatch, getState }) => {
        try {
            const result = await axios.get(
                '/user/usersbyemail',
                {
                    params: {
                        email
                    }
                }
            );
            if (result.status === 200) {
                if (result.data.response.length > 0) {
                    return true
                } else {
                    return false
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
)

export const saveUser = createAsyncThunk('usersApp/user/saveUser',

    async (userData, { dispatch, getState }) => {

        const body = {
            email: userData.data.email,
            mobilenumber: `${userData.data.countrycode}${userData.data.mobilenumber}`,
            firstname: userData.data.firstname,
            lastname: userData.data.lastname
        }
        try {
            const result = await axios.post('/tenant/adduser',
                body,
                {
                    params: {
                        tenant_id: userData.tenant_id,
                    }
                }
            )
            if (result.status === 200) {
                dispatch(showMessage({ message: result.data.message, variant: "success" }));
                return result.data.response
            }

        } catch (error) {
            console.log(error)
        }

    });

const userSlice = createSlice({
    name: 'usersApp/user',
    initialState: null,
    reducers: {
        resetUser: () => null,
        newUser: {
            reducer: (state, action) => action.payload,
            prepare: (event) => ({
                payload: {
                    email: "",
                    mobilenumber: "",
                    firstname: "",
                    lastname: ""
                },
            }),
        },
    },
    extraReducers: {
        [getUser.fulfilled]: (state, action) => action.payload,
        [saveUser.fulfilled]: (state, action) => action.payload,
    },
});

export const { newUser, resetUser } = userSlice.actions;

export const selectUser = ({ usersApp }) => usersApp.user;

export default userSlice.reducer;
