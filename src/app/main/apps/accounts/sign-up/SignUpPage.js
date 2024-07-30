import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import _ from '@lodash';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import JwtService from '../auth/services/jwtService';
import { LoadingButton } from '@mui/lab';
import OtpPage from '../otp/OtpPage';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import config from 'src/appConfig';
import { Link } from 'react-router-dom';

const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Enter a Email').matches(
    /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
    'Invalid email format'
  ),
  countrycode: yup.string().required('Select your country code'),
  mobileno: yup.string().required('Enter your Mob.no').test('is-valid-mobileno', function (value) {

    const { countrycode } = this.parent;

    if (countrycode === '+91') {
      if (!/^\d{10}$/.test(value)) {
        return this.createError({ message: 'Mob.no must contain 10 digits' });
      }
    } else if (countrycode === '+65') {
      if (!/^\d{8}$/.test(value)) {
        return this.createError({ message: 'Mob.no must contain 8 digits' });
      }
    } else {
      return this.createError({ message: 'Invalid country code' });
    }
    return true;

  }),
  password: yup.string()
    .required('Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Enter at least 8 characters (e.g. A@a123ab)'
    ),
  firstname: yup.string().required('Enter your Firstname').min(2, 'Firstname must be at least 2 characters'),
  lastname: yup.string().required('Enter your Lastname').min(2, 'Lastname must be at least 2 characters'),
  acceptTermsConditions: yup.boolean().oneOf([true], 'The terms and conditions must be accepted.'),
});

const defaultValues = {
  email: '',
  countrycode: '+91',
  mobileno: '',
  password: '',
  firstname: '',
  lastname: '',
  acceptTermsConditions: false,
};

const Country = [
  { name: "singapore", countrycode: 'sg', mobcode: '+65', label: 'Singapore' },
  { name: "india", countrycode: 'in', mobcode: '+91', label: 'India' }
]

function SignUpPage() {

  const [userdata, setUserdata] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch()

  const { control, formState, handleSubmit, setError, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit({ email, countrycode, mobileno, password, firstname, lastname }) {
    setLoading(true);
    mobileno = countrycode + mobileno
    try {
      const result = await JwtService.createTenant({ email, mobilenumber: mobileno, password, firstname, lastname });

      if (result.code === 0) {

        setLoading(false);
        dispatch(showMessage({ message: result.message, variant: "warning" }))

      } else if (result.code === 3 || result.code === 2) {
        /* 
        If result.code is equal to '3' or '2' it means user is registered in "tenant dynamodb", "cognito" and "user dynamodb"
        if result.code is equal to '3', it means user is already registered.
        if result.code is equal to '2', it means user is already registered but mobile number is not verified
        */
        dispatch(showMessage({ message: "OTP Sent!", variant: "success" }))
        setUserdata({ email, countrycode, mobileno, password, firstname, lastname });
        await JwtService.sendOtpToMobileNumber(mobileno)
        reset(defaultValues);
        setLoading(false)

      } else {
        console.log(result);
      }
    } catch (_errors) {
      console.log(_errors)
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
          <div className="text-7xl font-bold leading-none" style={{ color: "#004b1c" }}>
            <div className='text-center'>{config.application_name}</div>
          </div>
        </div>
      </Box>
      {userdata !== '' ?
        (<OtpPage usercredential={userdata} />) : (
          <Paper className="h-full sm:h-auto md:flex md:items-center justify-center w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none rtl:border-r-1 ltr:border-l-1">
            <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
              <div className='flex justify-center'>
                <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
                  Sign up
                </Typography>
              </div>
              <form
                name="registerForm"
                noValidate
                className="flex flex-col justify-center w-full mt-28"
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
                          disabled={loading}
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
              <div className="flex justify-center items-baseline mt-20 font-medium">
                <Typography>Already have an account?</Typography>
                <Link
                  className="ml-4"
                  to="/sign-in">
                  Sign in
                </Link>
              </div>
            </div>
          </Paper>
        )}
    </div>
  );
}

export default SignUpPage;
