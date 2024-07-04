import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { authRoles } from '../accounts/auth';


const Customers = lazy(() => import('./customers/customers'));
const Customer =lazy(()=>import('./customer/customer'));

const CustomersAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/customers/customers',
      element: <Customers />,
      auth: authRoles.seller
    },
    {
      path: 'apps/customers/customers/:customerId',
      element: <Customer />,
      auth: authRoles.seller
    },
    {
      path: 'apps/customers',
      element: <Navigate to="customers" />
    },
  ],
};

export default CustomersAppConfig;
