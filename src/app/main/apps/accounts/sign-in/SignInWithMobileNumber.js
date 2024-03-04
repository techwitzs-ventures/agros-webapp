import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import config from '../../../../configs/navigation-i18n/en'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import OtpPage from '../otp/otpPage';
import jwtService from '../auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import SignInWithUsernamePasswordPage from './SignInWithUsernamePassword';

const schema = yup.object().shape({
    mobileno: yup
        .string()
        .required('Enter your Mob.no')
        .matches(
            /^\+91\d{10}$/,
            'Invalid Mob.no format (e.g. +91930***4906)'
        )
});

const defaultValues = {
    mobileno: ''
};

function SignInWithMobileNumberPage() {

    const [userdataForOTPPage, setUserdataForOTPPage] = useState('');
    const [userdataForPasswordPage, setuserdataForPasswordPage] = useState('')

    const [loading, setloading] = useState(false);
    const [PasswordLoading, setPasswordLoading] = useState(false)

    const dispatch = useDispatch();

    const { control, formState, handleSubmit, setError, reset, getValues } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields, errors } = formState;

    async function onSubmit({ mobileno }) {
        setloading(true)
        try {
            const result = await jwtService.signIn(mobileno);
            if (!result.status && result.code === 0) {
                dispatch(showMessage({ message: 'Mobile Number Not Registered!', variant: "warning" }));
                setloading(false);
            } else if (result.status && result.code === 1) {
                setUserdataForOTPPage(mobileno)
                dispatch(showMessage({ message: "OTP Sent", variant: "success" }))
                setloading(false);
                reset(defaultValues);
            } else {
                console.log(result)
            }
        } catch (_errors) {
            _errors.forEach((error) => {
                setError(error.type, {
                    type: 'manual',
                    message: error.message,
                });
            });
        }
    }

    const handleUsernamePasswordSignInButton = async () => {
        setPasswordLoading(true)
        const mobileno = getValues('mobileno');
        try {
            const result = await jwtService.signInWithEmailPassword(mobileno)
            if (!result.status && result.code === 0) {
                dispatch(showMessage({ message: 'Mobile Number Not Registered!', variant: "warning" }));
                setPasswordLoading(false);
            } else if (result.status && result.code === 1) {
                setuserdataForPasswordPage(mobileno)
                setPasswordLoading(false);
                reset(defaultValues);
            } else {
                console.log(result)
            }
        } catch (_errors) {
            _errors.forEach((error) => {
                setError(error.type, {
                    type: 'manual',
                    message: error.message,
                });
            });
        }
    }

    return (
        <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0">
            <Box
                className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
                sx={{ backgroundColor: 'primary.main' }}
            >
                <svg
                    className="absolute inset-0 pointer-events-none"
                    viewBox="0 0 960 540"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMax slice"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <Box
                        component="g"
                        sx={{ color: 'primary.light' }}
                        className="opacity-20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="100"
                    >
                        <circle r="234" cx="196" cy="23" />
                        <circle r="234" cx="790" cy="491" />
                    </Box>
                </svg>
                <Box
                    component="svg"
                    className="absolute -top-64 -right-64 opacity-20"
                    sx={{ color: 'primary.light' }}
                    viewBox="0 0 220 192"
                    width="220px"
                    height="192px"
                    fill="none"
                >
                    <defs>
                        <pattern
                            id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                            x="0"
                            y="0"
                            width="20"
                            height="20"
                            patternUnits="userSpaceOnUse"
                        >
                            <rect x="0" y="0" width="4" height="4" fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
                </Box>

                <div className="z-10 relative w-full max-w-2xl">
                    <div className="text-7xl font-bold leading-none text-gray-100">
                        <div>Welcome to</div>
                        <div>{config.APPLICATION_NAME}</div>
                    </div>
                </div>
            </Box>
            {userdataForOTPPage !== '' ? (
                <OtpPage usercredential={userdataForOTPPage} />
            ) : (
                <Paper className="h-full sm:h-auto md:flex md:items-center w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none rtl:border-r-1 ltr:border-l-1">
                    <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
                        <div className="flex justify-center">
                            <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
                                Sign in
                            </Typography>
                        </div>
                        <div className="flex justify-center items-baseline mt-2 font-medium">
                            <Typography>Don't have an account?</Typography>
                            <Link className="ml-4" to={`https://${process.env.REACT_APP_ONBOARDING_URL}.${process.env.REACT_APP_HOST_NAME}/`}>
                                Create Account
                            </Link>
                        </div>

                        {userdataForPasswordPage !== '' ? (
                            <SignInWithUsernamePasswordPage usercredential={userdataForPasswordPage} />
                        ) : (<form
                            name="loginForm"
                            noValidate
                            className="flex flex-col justify-center w-full mt-32"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Controller
                                name="mobileno"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label="Mobile No"
                                        autoFocus
                                        disabled={loading || PasswordLoading}
                                        type="text"
                                        error={!!errors.mobileno}
                                        helperText={errors?.mobileno?.message}
                                        variant="outlined"
                                        required
                                        fullWidth
                                    />
                                )}
                            />

                            <LoadingButton
                                variant="contained"
                                color="secondary"
                                className=" w-full mt-16"
                                aria-label="Sign in"
                                disabled={_.isEmpty(dirtyFields) || !isValid || PasswordLoading}
                                type="submit"
                                size="large"
                                loading={loading}
                            >
                                <span>Sign In with OTP</span>
                            </LoadingButton>
                        </form>)}

                        {userdataForPasswordPage === '' && <div className='flex justify-center'>
                            <LoadingButton
                                variant="contained"
                                color="secondary"
                                className=" w-full mt-16"
                                aria-label="Sign in"
                                disabled={_.isEmpty(dirtyFields) || !isValid || loading}
                                size="large"
                                onClick={handleUsernamePasswordSignInButton}
                                loading={PasswordLoading}
                            >
                                <span>Sign in with Password</span>
                            </LoadingButton>
                        </div>}
                    </div>
                </Paper>
            )}
        </div>
    );
}

export default SignInWithMobileNumberPage;
