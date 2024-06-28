import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AccountVerification from './accountverification/accountVerification';
import { useAuth } from '../../../accounts/auth/AuthContext';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import { styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import BusinessVerification from './businessverification/businessVerification';
import CheckAndFinish from './checkandfinish/checkAndFinish';
import JwtService from '../../../accounts/auth/services/jwtService';
import withRouter from '@fuse/core/withRouter';

const steps = ['Account Verification', 'Business Verification', 'Review & Confirm', 'Check & Finish'];

const CustomStepIconRoot = styled('div')(({ theme, onboardingStep }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,  // Adjusted size of the circle
    height: 50, // Adjusted size of the circle
    borderRadius: '50%',
    backgroundColor: onboardingStep.completed ? theme.palette.success.main : theme.palette.primary.main,
    color: onboardingStep.completed ? theme.palette.common.white : theme.palette.success.main,
    border: `2px solid ${onboardingStep.active ? theme.palette.success.main : 'transparent'}`,
    fontWeight: 'bold',
    fontSize: '2rem', // Adjusted font size for the number
    ...(onboardingStep.active && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.success.main,
    }),
    '& .MuiSvgIcon-root': {
        fontSize: '2rem', // Adjusted size of the tick icon
    },
}));

function CustomStepIcon(props) {
    const { active, completed, icon } = props;

    return (
        <CustomStepIconRoot onboardingStep={{ active, completed }}>
            {completed ? <CheckIcon /> : icon}
        </CustomStepIconRoot>
    );
}

function AppStepper(props) {

    const [stripeAccountConfirmationStatus, setStripeAccountConfirmationStatus] = React.useState();

    const [stripeAccountDetails, setStripeAccountDetails] = React.useState();

    const [activeStep, setActiveStep] = React.useState();

    const user = useSelector(selectUser);

    const {
        mobileNumberVerificationStatus,
        emailVerificationStatus
    } = useAuth();


    React.useEffect(() => {

        const fetch_Stripe_accountDetails = async () => {

            const response = await axios.post('/stripe/retrieve_stripe_account', {
                account_id: user.tenant_data.account_id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {

                setStripeAccountConfirmationStatus(response.data.response.details_submitted)
                setStripeAccountDetails(response.data.response)
                return response.data.response

            } else {

                console.log("error", response.data.error)

            }

        }

        fetch_Stripe_accountDetails();

    }, [])

    React.useEffect(() => {

        if (stripeAccountConfirmationStatus !== undefined) {

            if (stripeAccountConfirmationStatus) {
                setActiveStep(2)
            } else if (mobileNumberVerificationStatus && emailVerificationStatus) {
                setActiveStep(1)
            } else {
                setActiveStep(0)
            }

        }

    }, [mobileNumberVerificationStatus, emailVerificationStatus, stripeAccountConfirmationStatus])

    const handleNext = async () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (activeStep === 3) {
            await updateOnboardingStatus();
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    if (stripeAccountConfirmationStatus === undefined) {
        return (
            <FuseLoading />
        )
    }

    const updateOnboardingStatus = async () => {
        try {
            await JwtService.updateOnboardingStatus({ username: user.data.mobilenumber, newOnBoardingStatus: true })
            props.navigate('/dashboards/project');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box className="flex flex-col items-center" sx={{ width: '100%' }}>

            <Stepper sx={{ fontSize: "30px" }} className='w-full' activeStep={activeStep} alternativeLabel>

                {steps.map((label, index) => {
                    return (
                        <Step key={label}>
                            <StepLabel
                                StepIconComponent={(props) => <CustomStepIcon {...props} icon={index + 1} />}
                                sx={{
                                    '& .MuiStepLabel-label': {
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                    },
                                    '& .MuiStepLabel-root': {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                    '& .MuiStepConnector-line': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }
                                }}
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    )
                })}
            </Stepper>

            {activeStep === steps.length ?
                (
                    <Box className="mt-20">
                        <Typography className="text-xl font-bold" sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <FuseLoading />
                    </Box>
                )
                :
                (
                    <Box className="flex flex-col lg:items-center w-full md:w-1/2 lg:w-3/5" sx={{ mt: 6 }}>

                        {activeStep === 0 && <AccountVerification />}
                        {activeStep === 1 && <BusinessVerification setStripeAccountConfirmationStatus={setStripeAccountConfirmationStatus} />}
                        {activeStep === 2 && <BusinessVerification setStripeAccountConfirmationStatus={setStripeAccountConfirmationStatus} />}
                        {activeStep === 3 && <CheckAndFinish stripeAccountDetails={stripeAccountDetails} />}

                        <Box className="w-full" sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            pt: 2,
                            justifyContent: activeStep === 3 ? "space-between" : "end"
                        }}>

                            {activeStep === 3 && <Button
                                variant='contained'
                                color="secondary"
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>}

                            <Button
                                variant='contained'
                                onClick={handleNext}
                                disabled={
                                    activeStep === 1 ?
                                        stripeAccountConfirmationStatus ? false : true :
                                        activeStep === 0 ?
                                            mobileNumberVerificationStatus && emailVerificationStatus ? false : true :
                                            false
                                }
                                color='secondary'
                            >
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>

                        </Box>

                    </Box>
                )
            }
        </Box>
    );
}

export default withRouter(AppStepper)
