import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import FormHelperText from '@mui/material/FormHelperText';
import _ from '@lodash';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Chip from '@mui/material/Chip';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { darken, lighten } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import JwtService from '../../../accounts/auth/services/jwtService';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';

function MobileCard(props) {
    const { title, subtitle, buttonTitle, verificationStatus } = props;

    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const schema = yup.object().shape({
        otp: yup.string().required('Enter Otp').matches(/^\d{6}$/, 'OTP must be 6 digits')
    });

    const defaultValues = {
        otp: '',
    };

    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields } = formState;

    async function onSubmit({ otp }) {
        try {
            const res = await JwtService.verifyMobileNumberOtp(user.data.mobilenumber, otp);
            if (res.success) {
                dispatch(showMessage({ message: "Mobile Number Verification Completed!", variant: "success" }))
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
            dispatch(showMessage({ message: "OTP Sent", variant: "success" }));
            await JwtService.sendOtpToMobileNumber(user.data.mobilenumber);
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
        <Paper
            className={clsx(
                'flex-col max-w-sm md:max-w-none p-24 sm:py-48 sm:px-40 relative'
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
                <span>{title}</span>
                {verificationStatus
                    ?
                    <FuseSvgIcon className="text-green-600 ms-8" size={25}>
                        heroicons-solid:badge-check
                    </FuseSvgIcon>
                    :
                    <Chip
                        className="font-semibold text-12 ms-12"
                        label="Not Verified"
                        sx={{
                            color: (theme) =>
                                theme.palette.mode === 'light'
                                    ? darken("#398D3D", 0.4)
                                    : lighten("#398D3D", 0.8),
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'light'
                                    ? lighten("#398D3D", 0.8)
                                    : darken("#398D3D", 0.1),
                        }}
                        size="small"
                    />}
            </div>

            <Typography className="mt-8 text-lg font-medium tracking-tight" color="text.secondary">
                {subtitle}
            </Typography>

            <Divider className="w-32 h-4 my-4 rounded bg-accent" />

            {!loading ? <LoadingButton
                className="mt-40 w-full"
                size="large"
                variant={verificationStatus ? 'contained' : 'outlined'}
                color={'success'}
                style={{ cursor: `${verificationStatus ? 'not-allowed' : 'allowed'}` }}
                loading={loading}
                onClick={() => sendOTPforVerification()}
            >
                {buttonTitle}
            </LoadingButton> :
                !_.isEmpty(dirtyFields) && isValid
                    ?
                    <Typography className='flex justify-center items-center mt-40 w-full text-2xl font-semibold tracking-tight leading-tight'>
                        Verifying Mobile Number...
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
                                        aria-disabled={loading}
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
    );
}

MobileCard.defaultProps = {
    title: '',
    subtitle: '',
    buttonTitle: '',
    verificationStatus: false
};

export default MobileCard;