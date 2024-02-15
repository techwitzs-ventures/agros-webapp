import authRoles from '../auth/authRoles';
import SignInWithMobileNumberPage from './SignInWithMobileNumber';
import SignInWithUsernamePasswordPage from './SignInWithUsernamePassword';

const SignInConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'sign-in',
      element: <SignInWithMobileNumberPage />,
    },
    {
      path: 'username-sign-in',
      element: <SignInWithUsernamePasswordPage />
    }
  ],
};

export default SignInConfig;
