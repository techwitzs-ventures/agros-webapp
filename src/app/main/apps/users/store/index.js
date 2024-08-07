import { combineReducers } from '@reduxjs/toolkit';
import vendors from './usersSlice'
import vendor from './userSlice'

const reducer = combineReducers({
    vendors,
    vendor
})

export default reducer