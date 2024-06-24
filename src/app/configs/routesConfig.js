import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import appsConfigs from '../main/apps/appsConfig';
import SignInConfig from '../main/apps/accounts/sign-in/SignInConfig';
import SignOutConfig from '../main/apps/accounts/sign-out/SignOutConfig';
import dashboardsConfigs from '../main/dashboards/dashboardsConfigs';
import ForgotPasswordConfig from '../main/apps/accounts/forgot-password/ForgotPasswordConfig';

const routeConfigs = [
  ...appsConfigs,
  ...dashboardsConfigs,
  SignOutConfig,
  SignInConfig,
  ForgotPasswordConfig
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="dashboards/project"/>,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '*',
    element: <Navigate to="pages/error/404" />,
  },
];

export default routes;
