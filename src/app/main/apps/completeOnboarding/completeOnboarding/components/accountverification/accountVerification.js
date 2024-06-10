import { showMessage } from 'app/store/fuse/messageSlice';
import { selectUser } from 'app/store/userSlice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/app/main/apps/accounts/auth/AuthContext';
import JwtService from 'src/app/main/apps/accounts/auth/services/jwtService';
import MobileCard from './components/mobileCard';
import EmailCard from './components/emailCard';
import { motion } from 'framer-motion';

const AccountVerification = () => {

    const {
        mobileNumberVerificationStatus,
        emailVerificationStatus
    } = useAuth()

    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    
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
                    dispatch(showMessage({ message: "Onboarding Completed!", variant: "success" }))
                    await JwtService.updateOnboardingStatus({ username: user.data.mobilenumber, newOnBoardingStatus: true })
                } else if (emailVerificationStatus) {
                    dispatch(showMessage({ message: "Email Verification Completed!", variant: "success" }))
                } else if (mobileNumberVerificationStatus) {
                    dispatch(showMessage({ message: "Mobile Number Verification Completed!", variant: "success" }))
                }
            } catch (error) {
                console.log(error)
            }
        }
        updateOnBoarding();
    }, [mobileNumberVerificationStatus, emailVerificationStatus])

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-6 lg:gap-y-0 md:gap-x-24"
        >
            <motion.div variants={item} style={{ marginTop: "15px" }}>
                <MobileCard
                    title="Mobile Number"
                    subtitle={user.data.mobilenumber}
                    buttonTitle={mobileNumberVerificationStatus ? "Verified" : "Verify"}
                    verificationStatus={mobileNumberVerificationStatus}
                />
            </motion.div>
            <motion.div variants={item} style={{ marginTop: "15px" }}>
                <EmailCard
                    title="Email"
                    subtitle={user.data.email}
                    buttonTitle={emailVerificationStatus ? "Verified" : "Verify"}
                    verificationStatus={emailVerificationStatus}
                />
            </motion.div>
        </motion.div>
    )
}

export default AccountVerification