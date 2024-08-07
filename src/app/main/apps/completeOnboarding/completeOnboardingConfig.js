import { lazy } from 'react';
import { authRoles } from '../accounts/auth';


const CompleteOnboardingPage = lazy(() => import('./completeOnboarding/completeOnboardingPage'));

const CompleteOnboardingConfig = {
    settings: {
        layout: {},
    },
    routes: [
        {
            path: 'completeonboarding',
            element: <CompleteOnboardingPage />,
            auth: authRoles.forall
        }
    ],
};

export default CompleteOnboardingConfig;
