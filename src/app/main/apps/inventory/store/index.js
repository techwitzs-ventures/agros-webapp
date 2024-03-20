import { combineReducers } from '@reduxjs/toolkit';
import item from './itemSlice';
import itemscategory from './itemsCategorySlice'
import itemscategories from './itemsCategoriesSlice';
import items from './itemsSlice';
import wishlistitems from './wishlistItemsSlice';
import wishlistitem from './wishlistSlice';
import wishlistcustomitem from './wishlistCutomSlice'

const reducer = combineReducers({
  itemscategories,
  items,
  item,
  itemscategory,
  wishlistitems,
  wishlistitem,
  wishlistcustomitem
});

export default reducer;
