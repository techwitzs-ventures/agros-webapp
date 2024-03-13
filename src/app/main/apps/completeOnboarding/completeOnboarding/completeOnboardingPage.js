import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import { useAuth } from '../../accounts/auth/AuthContext';
import EmailCard from './components/emailCard';
import MobileCard from './components/mobileCard';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import JwtService from '../../accounts/auth/services/jwtService';
import { useNavigate } from 'react-router-dom';

const CompleteOnboardingPage = (props) => {

    const {
        mobileNumberVerificationStatus,
        emailVerificationStatus,
    } = useAuth()
    
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const container = {
        show: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 100 },
        show: { opacity: 1, y: 0 },
    };

    useEffect(() => {
        const updateOnBoarding = async () => {
            try {
                if (mobileNumberVerificationStatus && emailVerificationStatus) {
                    navigate('/dashboards/project')
                    await JwtService.updateOnboardingStatus({ username: user.data.mobilenumber, newOnBoardingStatus: true })
                }
            } catch (error) {
                console.log(error)
            }
        }
        updateOnBoarding();
    }, [mobileNumberVerificationStatus, emailVerificationStatus])

    return (
        <div className="relative flex flex-col flex-auto min-w-0 overflow-hidden">
            <div className="relative pt-32 pb-48 sm:pt-80 sm:pb-96 px-24 sm:px-64 overflow-hidden">
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

                <div className="flex justify-center mt-40 sm:mt-80">
                    <div className="w-full max-w-sm md:max-w-7xl">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-6 lg:gap-y-0 md:gap-x-24"
                        >
                            <motion.div variants={item}>
                                <MobileCard
                                    title="Mobile Number"
                                    subtitle={user.data.mobilenumber}
                                    buttonTitle={mobileNumberVerificationStatus ? "Verified" : "Verify"}
                                    verificationStatus={mobileNumberVerificationStatus}
                                />
                            </motion.div>
                            <motion.div variants={item}>
                                <EmailCard
                                    title="Email"
                                    subtitle={user.data.email}
                                    buttonTitle={emailVerificationStatus ? "Verified" : "Verify"}
                                    verificationStatus={emailVerificationStatus}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompleteOnboardingPage
