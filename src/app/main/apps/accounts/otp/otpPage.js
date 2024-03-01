import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import _ from '@lodash';
import Box from '@mui/material/Box';
import { showMessage } from 'app/store/fuse/messageSlice';
import Paper from '@mui/material/Paper';
import { MuiOtpInput } from 'mui-one-time-password-input';
import FormHelperText from '@mui/material/FormHelperText';
import JwtService from '../auth/services/jwtService';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';

function OtpPage({ usercredential }) {

  const [loading, setLoading] = useState(false);
  const [OTPText, setOTPText] = useState({ text: 'Verify OTP', success: true })

  const dispatch = useDispatch();

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
    setLoading(true);
    try {
      const sendotp = otp.toString();
      if (typeof (usercredential) !== 'string') {
        if (!OTPText.success) {
          reset(defaultValues);
          setLoading(true);
          setOTPText({ text: 'Verify OTP', success: true });
          await JwtService.signIn({ body: { mobilenumber: usercredential.mobilenumber } });
          setLoading(false)
        } else {
          const response = await JwtService.verifyOtp(
            sendotp,
            usercredential.email,
            usercredential.mobilenumber,
            usercredential.firstname,
            usercredential.lastname
          );
          if (response !== true) {
            dispatch(showMessage({ message: 'Incorrect OTP' }));
            setOTPText({ text: 'Resend OTP', success: false });
            setLoading(false);
          } else {
            reset(defaultValues);
          }
        }
      } else {
        if (!OTPText.success) {
          reset(defaultValues);
          setLoading(true);
          setOTPText({ text: 'Verify OTP', success: true });
          await JwtService.signIn({ body: { mobilenumber: usercredential } });
          setLoading(false)
        } else {
          const response = await JwtService.verifyOtp(sendotp);
          if (response !== true) {
            dispatch(showMessage({ message: 'Incorrect OTP' }));
            setOTPText({ text: 'Resend OTP', success: false })
            setLoading(false);
          } else {
            reset(defaultValues);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Paper className="h-full sm:h-auto md:flex md:items-center w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none rtl:border-r-1 ltr:border-l-1">
      <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
        {OTPText.success !== false
          ?
          <div className='flex justify-center'>
            <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
              Enter OTP
            </Typography>
          </div>
          :
          <div className='flex justify-center'>
            <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
              Invalid OTP
            </Typography>
          </div>
        }
        {OTPText.success !== false
          ?
          <div className="flex justify-center items-baseline mt-2 font-medium">
            <Typography>An OTP has been sent on your Mobile Number</Typography>
          </div>
          :
          <div className="flex flex-col justify-center items-center mt-2 font-medium">
            <Typography>Send the OTP again</Typography>
            <Typography>{typeof (usercredential) !== 'string' ? `(Mobile Number: ${usercredential.mobilenumber})` : `(Mobile Number: ${usercredential})`}</Typography>
          </div>
        }
        <form
          name="registerForm"
          noValidate
          className="flex flex-col justify-center w-full mt-32"
          onSubmit={handleSubmit(onSubmit)}
        >
          {OTPText.success !== false && <Controller
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
                  className="mb-24"
                  variant="outlined"
                  required
                />
                {fieldState.invalid ? <FormHelperText error>Enter 6 digits OTP</FormHelperText> : null}
              </Box>
            )}
          />}
          <LoadingButton
            variant="contained"
            color="secondary"
            className="w-full mt-24"
            aria-label="Register"
            disabled={_.isEmpty(dirtyFields) || !isValid}
            type="submit"
            size="large"
            loading={loading}
          >
            <span>{OTPText.text}</span>
          </LoadingButton>
        </form>
      </div>
    </Paper>
  );
}

export default OtpPage;
