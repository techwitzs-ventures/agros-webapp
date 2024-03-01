import { lazy } from "react";
import { Navigate } from "react-router-dom";
import authRoles from "../accounts/auth/authRoles.js";

const Invoice = lazy(() => import("./invoice_ui/invoice.js"));
const Invoices = lazy(() => import("./received_invoices/invoices.js"));
const MyInvoices = lazy(() => import('./my_invoices/my_invoices.js'));
const AllInvoices=lazy(()=>import('./all_invoices/all_my_invoices.js'));
const invoiceConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "apps/invoice/:invoiceId/:organizationId",
      element: <Invoice />,
    },
    {
      path: "apps/invoice/receivedinvoices",
      element: <Invoices />,
      auth: authRoles.buyer
    },
    {
      path: "apps/invoice/myinvoices",
      element: <MyInvoices />,
      auth: authRoles.plateformseller
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
