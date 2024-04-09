import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { authRoles } from '../accounts/auth';


const Items = lazy(() => import('./items/items'));
const Item = lazy(() => import('./item/Item'));
const ItemsCategory = lazy(() => import('./itemsCategory/itemsCategory'));
const ItemsCategories = lazy(() => import('./itemsCategories/itemsCategories'));
const WishlistItems = lazy(() => import('./wishlistItems/wishlistItems'));
const WishlistItem = lazy(() => import('./wishlistItem/wishlistItem'));
const WishlistCustomItem = lazy(() => import('./wishlistCustomItem/wishlistCustomItem'));
const RetailersWishlist = lazy(() => import('./retailersWishlist/retailersWishlistItems'));

const ECommerceAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/inventory/items',
      element: <Items />,
      auth: authRoles.plateformadmin
    },
    {
      path: 'apps/inventory/itemscategory',
      element: <ItemsCategories />,
      auth: authRoles.plateformadmin
    },
    {
      path: 'apps/inventory/retailerswishlist',
      element: <RetailersWishlist />,
      auth: authRoles.plateformadmin
    },
    {
      path: 'apps/inventory/itemswishlist',
      element: <WishlistItems />,
      auth: authRoles.onlySellerAndReatiler
    },
    {
      path: 'apps/inventory/items/:itemId/*',
      element: <Item />,
      auth: authRoles.plateformadmin
    },
    {
      path: 'apps/inventory/items/:itemId/:wishlistId',
      element: <Item />,
      auth: authRoles.plateformadmin
    },
    {
      path: "apps/inventory/itemscategory/:itemscategoryId/*",
      element: <ItemsCategory />,
      auth: authRoles.plateformadmin
    },
    {
      path: 'apps/inventory/itemswishlist/:param1/:param2',
      element: <WishlistItem />,
      auth: authRoles.onlySellerAndReatiler
    },
    {
      path: 'apps/inventory/customitemswishlist/:param1/*',
      element: <WishlistCustomItem />,
      auth: authRoles.onlySellerAndReatiler
    },
    {
      path: 'apps/inventory/customitemswishlist/:param1/:param2',
      element: <WishlistCustomItem />,
      auth: authRoles.onlySellerAndReatiler
    },
    {
      path: 'apps/inventory',
      element: <Navigate to="items" />
    },
  ],
};

export default ECommerceAppConfig;
