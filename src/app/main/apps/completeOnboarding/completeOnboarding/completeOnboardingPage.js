import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import AppStepper from './components/stepper';

const CompleteOnboardingPage = (props) => {

    return (
        <div className="relative flex flex-col flex-auto min-w-0 overflow-scroll">
            <div className="relative pt-16 pb-32 sm:pt-32 sm:pb-32 px-24 sm:px-64 overflow-scroll">
                <svg
                    className="-z-1 absolute inset-0 pointer-events-none"
                    viewBox="0 0 960 540"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMax slice"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <Box
                        component="g"
                        sx={{ color: 'divider' }}
                        className="opacity-20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="100"
                    >
                        <circle r="234" cx="196" cy="23" />
                        <circle r="234" cx="790" cy="491" />
                    </Box>
                </svg>
                <div className="flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.05 } }}
                    >
                        <h2 className="text-xl font-semibold">Complete Your Onboarding</h2>
                    </motion.div>
                </div>

                <div className="flex justify-center mt-20 sm:mt-40">
                    <div className="w-full max-w-sm md:max-w-7xl">
                        <AppStepper />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompleteOnboardingPage



