import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import config from '../../../../configs/navigation-i18n/en'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import jwtService from '../auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';

const schema = yup.object().shape({
    countrycode: yup.string().required('Select your country code'),
    mobileno: yup
        .string()
        .required('Enter your Mob.no')
        .matches(
            /^\d{10}$/,
            'Mob.no contains 10 digits.'
        ),
    password: yup
        .string()
        .required('Please enter your password.')
});


const defaultValues = {
    mobileno: '',
    password: '',
    countrycode: '+91'
};

const Country = [
    { name: "singapore", countrycode: 'sg', mobcode: '+65', label: 'Singapore' },
    { name: "india", countrycode: 'in', mobcode: '+91', label: 'India' }
]

function SignInWithMobileNumberPage() {

    const [PasswordLoading, setPasswordLoading] = useState(false)

    const dispatch = useDispatch();

    const { control, formState, handleSubmit, setError, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields, errors } = formState;

    async function onSubmit({ countrycode, mobileno, password }) {
        setPasswordLoading(true)
        const mob=countrycode + mobileno
        try {
            const result = await jwtService.signInWithEmailPassword(mob, password)

            if (!result.status && result.code === 2) {

                dispatch(showMessage({ message: "Incorrect Username Password", variant: "error" }));
                setPasswordLoading(false);

            } else if (!result.status && result.code === 0) {

                dispatch(showMessage({ message: 'Mobile Number Not Registered!', variant: "warning" }));
                setPasswordLoading(false);

            } else if (result.status && result.code === 1) {

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

                    <form
                        name="loginForm"
                        noValidate
                        className="flex flex-col justify-center w-full mt-32"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className='flex justify-center items-center'>
                            <Controller
                                name="countrycode"
                                control={control}
                                render={({ field }) => (
                                    <FormControl className="mb-24" sx={{ width: '100px', paddingRight: "5px" }} required>
                                        <InputLabel>Country</InputLabel>
                                        <Select
                                            {...field}
                                            label="Country code"
                                            error={!!errors.countrycode}
                                            variant='outlined'
                                            disabled={PasswordLoading}
                                        >
                                            {Country.map((country) => {
                                                return (
                                                    <MenuItem key={country.countrycode} value={country.mobcode}>
                                                        {country.mobcode}
                                                    </MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="mobileno"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-24"
                                        label="Mobile No"
                                        autoFocus={true}
                                        disabled={PasswordLoading}
                                        type="text"
                                        error={!!errors.mobileno}
                                        helperText={errors?.mobileno?.message}
                                        variant="outlined"
                                        required
                                        fullWidth
                                    />
                                )}
                            />
                        </div>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-24"
                                    label="Password"
                                    type="password"
                                    disabled={PasswordLoading}
                                    error={!!errors.password}
                                    helperText={errors?.password?.message}
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
                            disabled={_.isEmpty(dirtyFields) || !isValid}
                            type="submit"
                            size="large"
                            loading={PasswordLoading}
                        >
                            <span>Sign In</span>
                        </LoadingButton>
                    </form>
                </div>
            </Paper>
        </div>
    );
}

export default SignInWithMobileNumberPage;
