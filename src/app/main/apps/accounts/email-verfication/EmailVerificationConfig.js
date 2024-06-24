import authRoles from '../auth/authRoles';
import EmailVerification from './EmailVerification';

const EmailVerificationConfig = {
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
            path: 'email-verification/:mobileno/:email/:verificationStatus',
            element: <EmailVerification />,
        }
    ],
};

export default EmailVerificationConfig;
