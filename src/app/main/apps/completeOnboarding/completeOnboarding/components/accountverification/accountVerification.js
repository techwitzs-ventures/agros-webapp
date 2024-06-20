import { selectUser } from 'app/store/userSlice';
import React from 'react'
import { useSelector } from 'react-redux';
import { useAuth } from 'src/app/main/apps/accounts/auth/AuthContext';
import MobileCard from './components/mobileCard';
import EmailCard from './components/emailCard';
import { motion } from 'framer-motion';

const AccountVerification = () => {

    const {
        mobileNumberVerificationStatus,
        emailVerificationStatus
    } = useAuth()

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


    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:w-3/5 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-y-6 lg:gap-y-0 md:gap-x-24"
        >
            <motion.div variants={item} style={{ marginTop: "15px" }}>
                <MobileCard
                    title="Mobile Number"
                    subtitle={user.data.mobilenumber}
                    buttonTitle="Verify"
                    verificationStatus={mobileNumberVerificationStatus}
                />
            </motion.div>
            <motion.div variants={item} style={{ marginTop: "15px" }}>
                <EmailCard
                    title="Email"
                    subtitle={user.data.email}
                    buttonTitle="Verify"
                    verificationStatus={emailVerificationStatus}
                />
            </motion.div>
        </motion.div>
    )
}

export default AccountVerification