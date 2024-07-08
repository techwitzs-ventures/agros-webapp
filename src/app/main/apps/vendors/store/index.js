import { combineReducers } from '@reduxjs/toolkit';
import vendors from './vendorsSlice'
import vendor from './vendorSlice'

const reducer = combineReducers({
    vendors,
    vendor
})

export default reducer