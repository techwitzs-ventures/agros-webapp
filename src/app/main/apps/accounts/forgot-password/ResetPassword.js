import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import jwtService from '../auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import config from 'src/appConfig';
import { MuiOtpInput } from 'mui-one-time-password-input';

const schema = yup.object().shape({
    otp: yup.string().required('Enter Otp').matches(/^\d{6}$/, 'OTP must be 6 digits'),
    password: yup
        .string()
        .required('Please enter your password.').min(6)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
            'Enter at least 8 characters, with one A,a,@,1'
        ),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password.'),
});

const defaultValues = {
    otp: '',
    password: '',
    confirmPassword: ''
};

function ResetPassword() {

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const rootParams = useParams();
    const { mobilenumber } = rootParams

    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields, errors } = formState;

    async function onSubmit({ otp, confirmPassword }) {
        try {

            setLoading(true)

            const result = await jwtService.resetPasswordSumbit(mobilenumber, otp, confirmPassword)

            if (result === "SUCCESS") {

                dispatch(showMessage({ message: "Password Reset Successfull!", variant: "success" }))

                navigate('/sign-in')

                setLoading(false)

                reset(defaultValues);

            } else if (result === 'CodeMismatchException') {

                dispatch(showMessage({ message: "Invalid Verification Code, try again", variant: "error" }))

                setLoading(false);

                reset(defaultValues);

            }
            else {

                console.log(result);

            }

        } catch (error) {

            console.log(error);

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
                    <div className="text-7xl font-bold leading-none" style={{ color: "#004b1c" }}>
                        <div className='text-center'>{config.application_name}</div>
                    </div>
                </div>
            </Box>
            <Paper className="h-full sm:h-auto md:flex md:items-center justify-center w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none rtl:border-r-1 ltr:border-l-1">
                <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">

                    <div className="flex justify-center">
                        <Typography className="mt-28 text-4xl font-extrabold tracking-tight leading-tight">
                            Reset Password
                        </Typography>
                    </div>
                    <div className="flex justify-center items-baseline mt-20 font-medium">
                        <Typography>OTP has been sent to Email Address linked with Mobile no.
                            <span className='text-1xl font-semibold ml-8'>{mobilenumber}</span></Typography>
                    </div>
                    <form
                        name="resetpasswordForm"
                        noValidate
                        className="flex flex-col justify-center w-full mt-32"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Controller
                            control={control}
                            name="otp"
                            rules={{ validate: (value) => value.length === 6 }}
                            render={({ field, fieldState }) => (
                                <Box>
                                    <MuiOtpInput
                                        sx={{ gap: 1 }}
                                        {...field}
                                        length={6}
                                        aria-disabled={loading}
                                        variant="outlined"
                                        required
                                    />
                                    {fieldState.invalid ? <FormHelperText error>Enter 6 digits OTP</FormHelperText> : null}
                                </Box>
                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-24 mt-24"
                                    label="Password"
                                    type="password"
                                    disabled={loading}
                                    error={!!errors.password}
                                    helperText={errors?.password?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-24"
                                    label="Confirm Password"
                                    type="password"
                                    disabled={loading}
                                    error={!!errors.confirmPassword}
                                    helperText={errors?.confirmPassword?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />

                        <LoadingButton
                            className='mb-24'
                            variant="contained"
                            color="secondary"
                            type='submit'
                            disabled={_.isEmpty(dirtyFields) || !isValid}
                            aria-label="Back"
                            loading={loading}
                        >
                            <span>Set Password</span>
                        </LoadingButton>

                    </form>

                </div>
            </Paper>
        </div>
    );
}

export default ResetPassword;
