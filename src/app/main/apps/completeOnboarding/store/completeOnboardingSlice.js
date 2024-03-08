import { createSlice } from "@reduxjs/toolkit";

const completeOnboardingSlice = createSlice({
    name: 'completeOnboarding',
    initialState: {
        emailVerificationStatus: false,
        phoneNumberVerificationStatus: false,
        onboardingStatus: false
    },
    reducers: {
        setEmailVerificationStatus: (state, action) => {
            state.emailVerificationStatus = action.payload;
        },
        setPhoneNumberVerificationStatus: (state, action) => {
            state.phoneNumberVerificationStatus = action.payload;
        },
        setOnboardingStatus: (state, action) => {
            state.onboardingStatus = action.payload;
        }
    }
});

export const { setEmailVerificationStatus, setPhoneNumberVerificationStatus, setOnboardingStatus } = completeOnboardingSlice.actions;

export const selectPhoneNumberVerificationStatus = (completeOnboarding) => completeOnboarding.phoneNumberVerificationStatus;

export default completeOnboardingSlice.reducer;
