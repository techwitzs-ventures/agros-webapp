import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { authRoles } from '../accounts/auth';


const Vendors = lazy(() => import('./vendors/vendors'));
const Vendor = lazy(() => import('./vendor/vendor'));

const VendorsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/vendors/vendors',
      element: <Vendors />,
      auth: authRoles.seller
    },
    {
      path: 'apps/vendors/vendors/:vendorId',
      element: <Vendor />,
      auth: authRoles.seller
    },
    {
      path: 'apps/vendors',
      element: <Navigate to="vendors" />
    },
  ],
};

export default VendorsAppConfig;
