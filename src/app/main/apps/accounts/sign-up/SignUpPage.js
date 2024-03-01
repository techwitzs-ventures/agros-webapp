import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import config from '../../../../configs/navigation-i18n/en';
import { showMessage } from 'app/store/fuse/messageSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import JwtService from '../auth/services/jwtService';
import OtpPage from '../otp/otpPage';
import { LoadingButton } from '@mui/lab';

const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Enter a Email'),
  mobileno: yup
    .string()
    .required('Enter your Mobile Number')
    .matches(
      /^(?:\+\d{1,3}\s?)?(?:\d{10}|\d{3}[-\s]?\d{4}[-\s]?\d{3})$/,
      'Invalid mobile number format'
    ),
  firstname: yup.string().required('Enter your Firstname'),
  lastname: yup.string().required('Enter your Lastname'),
  acceptTermsConditions: yup.boolean().oneOf([true], 'The terms and conditions must be accepted.'),
});

const defaultValues = {
  email: '',
  mobileno: '',
  firstname: '',
  lastname: '',
  acceptTermsConditions: false,
};

function SignUpPage() {
  const [userdata, setUserdata] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { control, formState, handleSubmit, setError, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit({ email, mobileno, firstname, lastname }) {
    setLoading(true);
    try {
      const mobile_result = await JwtService.getUserByMobileNumber({ body: { mobilenumber: mobileno } });
      if (mobile_result.response !== null) {
        setLoading(false);
        dispatch(showMessage({ message: "Mobile Number already exist" }));
      } else {
        const email_check = await JwtService.getUserByEmail({ body: { email: email } })
        if (email_check.response !== null) {
          setLoading(false);
          dispatch(showMessage({ message: "Email Id already exist" }));
        } else {
          setUserdata({ email, mobilenumber: mobileno, firstname, lastname });
          JwtService.signIn({ body: { email, mobilenumber: mobileno, } });
          reset(defaultValues);
          setLoading(false);
        }
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

      {userdata !== '' ? (
        <OtpPage usercredential={userdata} />
      ) : (
        <Paper className="h-full sm:h-auto md:flex md:items-center w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none rtl:border-r-1 ltr:border-l-1">
          <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
            <div className='flex justify-center'>
              <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
                Sign up
              </Typography>
            </div>
            <div className="flex justify-center items-baseline mt-2 font-medium">
              <Typography>Already have an account?</Typography>
              <Link className="ml-4" to="/sign-in">
                Sign in
              </Link>
            </div>
            <form
              name="registerForm"
              noValidate
              className="flex flex-col justify-center w-full mt-32"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Email"
                    type="email"
                    autoFocus
                    disabled={loading}
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
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
                    type="text"
                    disabled={loading}
                    error={!!errors.mobileno}
                    helperText={errors?.mobileno?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
              <Controller
                name="firstname"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Firstname"
                    type="name"
                    disabled={loading}
                    error={!!errors.firstname}
                    helperText={errors?.firstname?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="lastname"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Lastname"
                    type="name"
                    disabled={loading}
                    error={!!errors.lastname}
                    helperText={errors?.lastname?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="acceptTermsConditions"
                control={control}
                render={({ field }) => (
                  <FormControl disabled={loading} className="items-center" error={!!errors.acceptTermsConditions}>
                    <FormControlLabel
                      label="I agree to the Terms of Service and Privacy Policy"
                      control={<Checkbox size="small" {...field} />}
                    />
                    <FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
                  </FormControl>
                )}
              />

              <LoadingButton
                variant="contained"
                color="secondary"
                className="w-full mt-24"
                aria-label="Register"
                disabled={_.isEmpty(dirtyFields) || !isValid}
                type="submit"
                size="large"
                loading={loading}
                loadingIndicator="Creating account..."
              >
                <span>Create account</span>
              </LoadingButton>
            </form>
          </div>
        </Paper>
      )}
    </div>
  );
}

export default SignUpPage;
