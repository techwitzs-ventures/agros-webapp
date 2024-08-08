import { createSlice } from "@reduxjs/toolkit";


const userVerificationSlice = createSlice({
    name: "status",
    initialState: {
        onboardingStatus: false,
        emailVerifcationStatus: false,
        mobileVerificationStatus: false
    },
    reducers: {
        setOnboardingStatus: {
            reducer: (state, action) => {
                state.onboardingStatus = action.payload
            }
        },
        setEmailVerificationStatus: {
            reducer: (state, action) => {
                state.emailVerifcationStatus = action.payload
            }
        },
        setMobileVerificationStatus: {
            reducer: (state, action) => {
                state.mobileVerificationStatus = action.payload
            }
        }
    }
});

export const { setEmailVerificationStatus, setOnboardingStatus, setMobileVerificationStatus } = userVerificationSlice.actions;

export const selectUserOnboardingStatus = ({ status }) => status.onboardingStatus;

export const selectUserEmailVerificationStatus = ({ status }) => status.emailVerifcationStatus;

export const selectUserMobileVerificationStatus = ({ status }) => status.mobileVerificationStatus;

export default userVerificationSlice.reducer