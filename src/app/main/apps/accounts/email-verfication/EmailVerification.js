import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, Backdrop, CircularProgress, Chip, darken, lighten, Divider, FormHelperText } from "@mui/material";
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
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { MuiOtpInput } from 'mui-one-time-password-input';

const schema = yup.object().shape({
    otp: yup.string().required('Enter Otp').matches(/^\d{6}$/, 'OTP must be 6 digits')
});

const defaultValues = {
    otp: '',
};

function EmailVerification() {

    const navigate = useNavigate();
    const rootParams = useParams();
    const dispatch = useDispatch()

    const { mobileno, email, verificationStatus } = rootParams
    const [Loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields } = formState;


    async function onSubmit({ otp }) {
        try {
            const res = await jwtService.verifyEmailOtp(mobileno, otp);
            if (res.success) {
                navigate('/forgot-password')
                setLoading(false)
                setOpen(false)
                reset(defaultValues)
            } else {
                dispatch(showMessage({ message: "Incorrect OTP!", variant: "error" }))
                setLoading(false)
                setOpen(false)
                reset(defaultValues)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const sendOTPforVerification = async () => {
        setLoading(true)
        try {
            dispatch(showMessage({ message: "OTP Sent!", variant: "success" }));
            await jwtService.sendOtpToEmail(email);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!_.isEmpty(dirtyFields) && isValid) {
            setOpen(true)
            const handleSubmitEventCalled = async () => {
                try {
                    await handleSubmit(onSubmit)();
                } catch (error) {
                    console.log(error)
                }
            };
            handleSubmitEventCalled();
        }
    }, [isValid, dirtyFields, handleSubmit, onSubmit])

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
                            Email Verification
                        </Typography>
                    </div>
                    <Paper
                        className={clsx(
                            'flex-col max-w-sm md:max-w-none p-24 sm:py-48 sm:px-40 relative mt-8'
                        )}
                        style={{ minHeight: "262px" }}
                    >
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={open}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>

                        <div className="flex items-center text-4xl font-bold tracking-tight leading-tight">
                            <span>Email</span>
                            {verificationStatus === 'true'
                                ?
                                <FuseSvgIcon className="ms-8" sx={{ color: "#004b1c" }} size={25}>
                                    heroicons-solid:badge-check
                                </FuseSvgIcon>
                                :
                                <Chip
                                    className="font-semibold text-12 ms-12"
                                    label="Not Verified"
                                    sx={{
                                        color: (theme) =>
                                            theme.palette.mode === 'light'
                                                ? darken("#004b1c", 0.4)
                                                : lighten("#004b1c", 0.8),
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === 'light'
                                                ? lighten("#004b1c", 0.8)
                                                : darken("#004b1c", 0.1),
                                    }}
                                    size="small"
                                />}
                        </div>

                        <Typography className="mt-8 text-lg font-medium tracking-tight" color="text.secondary">
                            {email}
                        </Typography>

                        <Divider className="w-32 h-4 my-4 rounded bg-accent" />

                        {!Loading ?
                            verificationStatus === 'false' && <LoadingButton
                                className="mt-40 w-full"
                                size="large"
                                variant='outlined'
                                sx={{ color: "#004b1c" }}
                                loading={Loading}
                                onClick={() => sendOTPforVerification()}
                            >
                                Verify
                            </LoadingButton> :
                            !_.isEmpty(dirtyFields) && isValid
                                ?
                                <Typography className='flex justify-center items-center mt-40 w-full text-2xl font-semibold tracking-tight leading-tight'>
                                    Verifying Email...
                                </Typography>
                                :
                                <form
                                    name="registerForm"
                                    noValidate
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
                                                    aria-disabled={Loading}
                                                    className="mt-40 w-full"
                                                    variant="outlined"
                                                    aria-autocomplete
                                                    required
                                                />
                                                {fieldState.invalid ? <FormHelperText error>Enter 6 digits OTP</FormHelperText> : null}
                                            </Box>
                                        )}
                                    />
                                </form>
                        }
                    </Paper>

                </div>
            </Paper>
        </div>
    );
}

export default EmailVerification;
