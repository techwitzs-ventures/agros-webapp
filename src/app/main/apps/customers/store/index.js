import { combineReducers } from '@reduxjs/toolkit';
import customers from './customersSlice'
import customer from './customerSlice'

const reducer = combineReducers({
    customers,
    customer
})

export default reducer