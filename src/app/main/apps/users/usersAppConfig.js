import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { authRoles } from '../accounts/auth';


const Users = lazy(() => import('./users/users'));
const User = lazy(() => import('./user/user'));

const UsersAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'apps/users/users',
      element: <Users />,
      auth: authRoles.plateformadmin
    },
    {
      path: 'apps/users/users/:userId',
      element: <User />,
      auth: authRoles.plateformadmin
    },
    {
      path: 'apps/users',
      element: <Navigate to="users" />
    },
  ],
};

export default UsersAppConfig;
