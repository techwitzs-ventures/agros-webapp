import i18next from 'i18next';

import en from './navigation-i18n/en';
import authRoles from '../main/apps/accounts/auth/authRoles';

i18next.addResourceBundle('en', 'navigation', en);

const navigationConfig = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    type: 'item',
    auth: authRoles.forall,
    icon: 'heroicons-outline:home',
    translate: 'DASHBOARDS',
    url: 'dashboards/project'
  },
  {
    id: 'vendors',
    title: 'Vendors',
    type: 'item',
    auth: authRoles.onlySellerAndRetailer,
    icon: 'heroicons-outline:user-group',
    url: 'apps/vendors/vendors'
  },
  {
    id: 'customers',
    title: 'Customers',
    type: 'item',
    auth: authRoles.onlySellerAndRetailer,
    icon: 'heroicons-outline:user-group',
    url: 'apps/customers/customers'
  },
  {
    id: 'marketplace.itemswishlist',
    title: 'Products',
    type: 'item',
    icon: 'heroicons-outline:shopping-cart',
    auth: authRoles.onlySellerAndRetailer,
    url: 'apps/inventory/itemswishlist'
  },
  {
    id: 'apps.inventory',
    title: 'Products',
    auth: authRoles.plateformadmin,
    type: 'collapse',
    translate: 'Products',
    icon: 'heroicons-outline:shopping-cart',
    children: [
      {
        id: 'inventory-items-category',
        title: 'Items Category',
        type: 'item',
        auth: authRoles.plateformadmin,
        url: 'apps/inventory/itemscategory',
        end: true,
      },
      {
        id: 'inventory-items',
        title: 'Items',
        type: 'item',
        auth: authRoles.plateformadmin,
        url: 'apps/inventory/items',
        end: true,
      },
      {
        id: 'inventory-retailerswishlist',
        title: "Retailer's Wishlist",
        type: 'item',
        auth: authRoles.plateformadmin,
        url: 'apps/inventory/retailerswishlist',
        end: true,
      }
    ],
  },
  {
    id: 'users',
    title: 'Users',
    type: 'item',
    auth: authRoles.plateformadmin,
    icon: 'heroicons-outline:user-group',
    url: 'apps/users/users'
  },
  // {
  //   id: 'marketplace.my-purchase-orders',
  //   title: 'Purchase Orders',
  //   type: 'item',
  //   auth: authRoles.retailer,
  //   icon: 'material-outline:inventory',
  //   url: 'apps/order/purchaseorder',
  //   end: true,
  // },
  // {
  //   id: 'marketplace.recieved-purchase-orders',
  //   title: 'Purchase Orders',
  //   type: 'item',
  //   auth: authRoles.seller,
  //   icon: 'material-outline:inventory',
  //   url: 'apps/order/recievedpurchaseorder',
  //   end: true,
  // },
  // {
  //   id: 'marketplace.my-sales-orders',
  //   title: 'Sales Orders',
  //   type: 'item',
  //   auth: authRoles.seller,
  //   icon: 'material-outline:inventory_2',
  //   url: 'apps/order/salesorder',
  //   end: true,
  // },
  // {
  //   id: "marketplace.revieved-sales-orders",
  //   title: "Sales Orders",
  //   type: "item",
  //   auth: authRoles.retailer,
  //   icon: 'material-outline:inventory_2',
  //   url: "apps/order/recievedsalesorder",
  //   end: true,
  // },
  {
    id: "marketplace.invoices",
    title: "Invoices",
    type: "item",
    auth: authRoles.seller,
    icon: 'heroicons-outline:calculator',
    url: "apps/invoice/invoices",
    end: true,
  },
  {
    id: 'marketplace.allpurchaseorders',
    title: 'Purchase Orders',
    type: 'item',
    auth: authRoles.plateformadmin,
    icon: 'material-outline:inventory',
    url: "apps/order/allpurchaseorder",
    end: true
  },
  {
    id: 'marketplace.allsalesorders',
    title: 'Sales Orders',
    type: 'item',
    auth: authRoles.plateformadmin,
    icon: 'material-outline:inventory_2',
    url: "apps/order/allsalesorder",
    end: true
  },
  {
    id: 'marketplace.allinvoices',
    title: 'Invoices',
    type: 'item',
    auth: authRoles.plateformadmin,
    icon: 'heroicons-outline:calculator',
    url: "apps/invoice/allinvoices",
    end: true
  }
];

export default navigationConfig;
