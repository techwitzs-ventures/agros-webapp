import { combineReducers } from '@reduxjs/toolkit';
import buyersinventory from './inventoryItemsSlice';

const reducer = combineReducers({
    buyersinventory
});

export default reducer;