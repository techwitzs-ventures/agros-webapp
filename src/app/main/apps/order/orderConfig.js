import { lazy } from "react";
import { Navigate } from "react-router-dom";
import authRoles from "../accounts/auth/authRoles.js";

const SinglePurchaseOrder = lazy(() =>
  import("./single_purchase_order/single_purchase_order.js")
);
const PurchaseOrders = lazy(() =>
  import("./purchase_orders/purchase_orders.js")
);
const SalesOrders = lazy(() => import("./sales_orders/sales_orders.js"));
const SingleSalesOrder = lazy(() =>
  import("./single_sales_order/single_sales_order.js")
);
const RecievedPurchaseOrders = lazy(() => import("./recieved_purchase_orders/recieved_purchase_orders.js"))
const RecievedSalesOrder = lazy(() => import("./recieved_sales_orders/recieved_sales_orders.js"))
const AllPurchaseOrders = lazy(() => import('./all_purchase_orders/all_purchase_orders.js'));
const AllSalesOrders = lazy(() => import('./all_sales_orders/all_sales_orders.js'));
const ViewSinglePurchaseOrder = lazy(() => import('./view_purchase_order/view_single_purchase_order.js'));
const ViewSingleSalesOrder = lazy(() => import('./view_sales_order/view_single_sales_order.js'));

const orderConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "apps/order/purchaseorder",
      element: <PurchaseOrders />,
      auth: authRoles.buyer
    },
    {
      path: "apps/order/salesorder",
      element: <SalesOrders />,
      auth: authRoles.plateformseller
    },
    {
      path: "apps/order/recievedpurchaseorder",
      element: <RecievedPurchaseOrders />,
      auth: authRoles.plateformseller
    },
    {
      path: "apps/order/allpurchaseorder",
      element: <AllPurchaseOrders />,
      auth: authRoles.plateformadmin
    },
    {
      path: "apps/order/recievedsalesorder",
      element: <RecievedSalesOrder />,
      auth: authRoles.buyer
    },
    {
      path: "apps/order/allsalesorder",
      element: <AllSalesOrders />,
      auth: authRoles.plateformadmin
    },
    {
      path: "apps/order/salesorder/:salesorderId/*",
      element: <SingleSalesOrder />,
      auth: authRoles.plateformseller
    },
    {
      path: "apps/order/salesorder/:salesorderId/:organizationId",
      element: <SingleSalesOrder />,
      auth: authRoles.plateformseller
    },
    {
      path: "apps/order/purchaseorder/:purchaseorderId/*",
      element: <SinglePurchaseOrder />,
      auth: authRoles.buyer
    },
    {
      path: "apps/order/purchaseorder/:purchaseorderId/:organizationId",
      element: <SinglePurchaseOrder />,
      auth: authRoles.buyer
    },
    {
      path: "apps/order/viewpurchaseorder/:purchaseorderId/:organizationId",
      element: <ViewSinglePurchaseOrder />,
    },
    {
      path: "apps/order/viewsalesorder/:salesorderId/:organizationId",
      element: <ViewSingleSalesOrder />,
    },
    {
      path: "apps/order",
      element: <Navigate to="purchaseorder" />,
    },
  ],
};

export default orderConfig;
