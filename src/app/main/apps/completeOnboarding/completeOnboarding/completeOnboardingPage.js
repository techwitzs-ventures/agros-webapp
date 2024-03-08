import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPhoneNumberVerificationStatus, setPhoneNumberVerificationStatus } from '../store/completeOnboardingSlice';
import reducer from '../store/index';
import withReducer from 'app/store/withReducer';

const CompleteOnboardingPage = () => {
    const dispatch = useDispatch();
    const phoneNumberVerificationStatus = useSelector(selectPhoneNumberVerificationStatus);

    console.log(phoneNumberVerificationStatus);

    return (
        <div onClick={() => dispatch(setPhoneNumberVerificationStatus(true))}>
            Complete Onboarding Page
        </div>
    );
}

export default withReducer('completeOnboarding', reducer)(CompleteOnboardingPage);
