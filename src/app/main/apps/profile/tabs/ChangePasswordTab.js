import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { motion } from 'framer-motion';
import { LoadingButton } from '@mui/lab';
import FormHelperText from '@mui/material/FormHelperText';
import JwtService from '../../accounts/auth/services/jwtService';
import { TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';

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



function Basic() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit({ otp, confirmPassword }) {
    try {
      setLoading(true)
      const result = await JwtService.resetPasswordSumbit(user.data.mobilenumber, otp, confirmPassword)
      if (result === "SUCCESS") {
        dispatch(showMessage({ message: "Password Reset Successfull" }))
        setLoading(false)
        reset(defaultValues);
        setShowForm(false)
      } else if (result === 'CodeMismatchException') {
        dispatch(showMessage({ message: "Invalid Verification Code, try again" }))
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

  const handleEmailClick = async (e) => {
    e.preventDefault();
    try {
      const result = await JwtService.sendEmailOTPForResetPassword(user.data.mobilenumber);
      if (result) {
        setShowForm(true)
        dispatch(showMessage({ message: `OTP sent to ${result.CodeDeliveryDetails.Destination}` }))
      } else {
        console.log("Error occured")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className='md:w-full sm:w-auto w-full'>
      <div className="md:flex">
        <div className="flex flex-col md:items-center md:ltr:pr-32 md:rtl:pl-32 w-full">
          {!showForm && <LoadingButton
            variant="contained"
            color="secondary"
            disabled={showForm}
            className='md:w-1/3 align-center'
            aria-label="Back"
            onClick={handleEmailClick}
          >
            <span>Send Email OTP To Reset Password</span>
          </LoadingButton>}
          {showForm && <Card component={motion.div} variants={item} className="flex mb-32 mt-16">
            <CardContent className="flex flex-col md:items-center flex-1 px-32 py-24">
              <form
                name="loginForm"
                noValidate
                className="flex flex-col justify-center mt-32 md:w-1/2"
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
            </CardContent>
          </Card>}
        </div>
      </div>
    </motion.div>
  );
}

export default Basic;
