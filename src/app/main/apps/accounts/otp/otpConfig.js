import OtpPage from './otpPage';
import authRoles from '../auth/authRoles';
const OtpPageConfig = {
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
            path: 'otp',
            element: <OtpPage />,
        },
    ],
};

export default OtpPageConfig;