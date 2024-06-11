import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AccountVerification from './accountverification/accountVerification';

const steps = ['Account Verification', 'Business Verification', 'Review & Completed'];

export default function AppStepper() {

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => {
                    const labelProps = {}
                    return (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>

            {activeStep === steps.length ?
                (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button
                                variant='contained'
                                color='secondary'
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                        </Box>
                    </React.Fragment>
                )
                :
                (
                    <Box sx={{ mt: 6 }}>
                        {activeStep === 0 && <AccountVerification />}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            pt: 2,
                            justifyContent: "space-between"
                        }}>
                            <Button
                                variant='contained'
                                color="secondary"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Button
                                variant='contained'
                                onClick={handleNext}
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
