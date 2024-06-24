import authRoles from '../auth/authRoles';
import ResetPasswordPage from './ResetPassword';
import ForgotPasswordPage from './ForgotPassword';

const ForgotPasswordConfig = {
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
            path: 'forgot-password',
            element: <ForgotPasswordPage />,
        },
        {
            path: 'reset-password/:mobilenumber',
            element: <ResetPasswordPage />
        }
    ],
};

export default ForgotPasswordConfig;
