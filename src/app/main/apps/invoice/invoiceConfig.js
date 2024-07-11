import { lazy } from "react";
import { Navigate } from "react-router-dom";
import authRoles from "../accounts/auth/authRoles.js";

const Invoice = lazy(() => import("./invoice/Invoice.js"));
const Invoices = lazy(() => import('./invoices/invoices.js'));
const AllInvoices=lazy(()=>import('./allInvoices/all_my_invoices.js'));

const invoiceConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "apps/invoice/invoices",
      element: <Invoices />,
      auth: authRoles.seller
    },
    {
      path: "apps/invoice/invoices/:invoiceId",
      element: <Invoice />,
      auth: authRoles.seller
    },
    {
      path: "apps/invoice/allinvoices",
      element: <AllInvoices />,
      auth: authRoles.plateformadmin
    },
    {
      path: "apps",
      element: <Navigate to="invoice" />,
    },
  ],
};

export default invoiceConfig;
