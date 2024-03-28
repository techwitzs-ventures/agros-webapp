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
    id: 'marketplace.inventory',
    title: 'Inventory',
    type: 'item',
    auth: authRoles.buyer,
    url: 'apps/buyersinventory/buyersinventoryitems'
  },
  {
    id: 'marketplace.itemswishlist',
    title: 'Items Wishlist',
    type: 'item',
    auth: authRoles.buyer,
    url: 'apps/inventory/itemswishlist'
  },
  {
    id: 'apps.inventory',
    title: 'Products',
    auth: authRoles.plateformadmin,
    type: 'collapse',
    translate: 'Products',
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
        id: 'inventory-buyerswishlist',
        title: "Buyer's Wishlist",
        type: 'item',
        auth: authRoles.plateformadmin,
        url: 'apps/inventory/buyerswishlist',
        end: true,
      }
    ],
  },
  {
    id: 'marketplace.my-purchase-orders',
    title: 'Purchase Orders',
    type: 'item',
    auth: authRoles.buyer,
    url: 'apps/order/purchaseorder',
    end: true,
  },
  {
    id: 'marketplace.recieved-purchase-orders',
    title: 'Purchase Orders',
    type: 'item',
    auth: authRoles.plateformseller,
    url: 'apps/order/recievedpurchaseorder',
    end: true,
  },
  {
    id: 'marketplace.my-sales-orders',
    title: 'Sales Orders',
    type: 'item',
    auth: authRoles.plateformseller,
    url: 'apps/order/salesorder',
    end: true,
  },
  {
    id: "marketplace.revieved-sales-orders",
    title: "Sales Orders",
    type: "item",
    auth: authRoles.buyer,
    url: "apps/order/recievedsalesorder",
    end: true,
  },
  {
    id: "marketplace.myinvoices",
    title: "Invoices",
    type: "item",
    auth: authRoles.plateformseller,
    url: "apps/invoice/myinvoices",
    end: true,
  },
  {
    id: "marketplace.receivedinvoices",
    title: "Invoices",
    type: "item",
    auth: authRoles.buyer,
    url: "apps/invoice/receivedinvoices",
    end: true,
  },
  {
    id: 'marketplace.allpurchaseorders',
    title: 'All Purchase Orders',
    type: 'item',
    auth: authRoles.plateformadmin,
    url: "apps/order/allpurchaseorder",
    end: true
  },
  {
    id: 'marketplace.allsalesorders',
    title: 'All Sales Orders',
    type: 'item',
    auth: authRoles.plateformadmin,
    url: "apps/order/allsalesorder",
    end: true
  },
  {
    id: 'marketplace.allinvoices',
    title: 'All Invoices',
    type: 'item',
    auth: authRoles.plateformadmin,
    url: "apps/invoice/allinvoices",
    end: true
  },
  {
    id: 'marketplace.users',
    title: 'All Users',
    type: 'item',
    auth: authRoles.plateformadmin
  },
  {
    id: 'marketplace.settings',
    title: 'Settings',
    type: 'item',
    disabled: true
  },
];

export default navigationConfig;
