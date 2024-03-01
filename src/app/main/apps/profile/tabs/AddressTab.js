import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import EditIcon from '@mui/icons-material/Edit';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import JwtService from '../../accounts/auth/services/jwtService';


const schema = yup.object().shape({
  address1: yup.string().required('Field Required').min(3),
  address2: yup.string().required('Field Required').min(3),
  city: yup.string().required('Enter Your City').min(2),
  state: yup.string().required('Enter Your State').min(2),
  country: yup.string().required('Enter Your Country'),
  zipCode: yup.string().required('Enter Zip Code').min(6),
});


function Address() {
  const user = useSelector(selectUser);
  const test = (x) => x + 1;
  const [editEnabled, setEditEnabled] = useState(false)
  const [loading, setLoading] = useState(false);

  const countries = [
    { id: 'ind', name: 'India' },
    { id: 'sing', name: 'Singapore' },
  ];


  const defaultValues = {
    address1: user.data.address1,
    address2: user.data.address2,
    city: user.data.city,
    state: user.data.state,
    country: user.data.country,
    zipCode: user.data.zipCode
  };

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
  const { control, formState, handleSubmit, setError, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;

  const handleEditEnable = async () => {
    setEditEnabled(true)
    reset(defaultValues);
  }

  async function onSubmit({ address1, address2, city, state, country, zipCode }) {
    setLoading(true)
    const request = {
      body: {
        email: user.data.email,
        mobilenumber: user.data.mobilenumber,
        firstname: user.data.firstname,
        lastname: user.data.lastname,
        address1,
        address2,
        city,
        state,
        country,
        zipCode
      }
    }
    await JwtService.updateUserCredentialByUUID(request, user.organization_id);
    setEditEnabled(false);
    setLoading(false)
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className='md:w-full sm:w-auto w-full'>
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
          {!editEnabled
            ? <Card component={motion.div} variants={item} className="flex mb-32">
              <CardContent className="flex flex-col flex-1 px-32 py-24">
                <div className="mb-24">
                  <Typography className="font-semibold mb-4 text-15">Address 1</Typography>
                  <Typography>{user.data.address1 !== "" ? user.data.address1 : " - "}</Typography>
                </div>

                <div className="mb-24">
                  <Typography className="font-semibold mb-4 text-15">Address 2</Typography>
                  <Typography>{user.data.address2 !== "" ? user.data.address2 : " - "}</Typography>
                </div>

                <div className="mb-24">
                  <Typography className="font-semibold mb-4 text-15">City</Typography>
                  <Typography>{user.data.city !== "" ? user.data.city : " - "}</Typography>
                </div>

                <div className="mb-24">
                  <Typography className="font-semibold mb-4 text-15">State</Typography>
                  <Typography>{user.data.state !== "" ? user.data.state : " - "}</Typography>
                </div>

                <div className="mb-24">
                  <Typography className="font-semibold mb-4 text-15">Country</Typography>
                  <Typography>{user.data.country !== "" ? user.data.country : " - "}</Typography>
                </div>

                <div className="mb-24">
                  <Typography className="font-semibold mb-4 text-15">Zip Code/Postal Code</Typography>
                  <Typography>{user.data.zipCode !== "" ? user.data.zipCode : " - "}</Typography>
                </div>
              </CardContent>
              <div className='px-32 py-24'>
                <IconButton aria-label="edit" onClick={handleEditEnable}>
                  <EditIcon />
                </IconButton>
              </div>
            </Card> :
            <Card component={motion.div} variants={item} className="flex mb-32">
              <CardContent className="flex flex-col flex-1 px-32 py-24">
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Controller
                    name="address1"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Address 1"
                        type="text"
                        disabled={loading}
                        error={!!errors.address1}
                        helperText={errors?.address1?.message}
                        variant="outlined"
                        required
                      />
                    )}
                  />

                  <Controller
                    name="address2"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Address 2"
                        type="text"
                        disabled={loading}
                        error={!!errors.address2}
                        helperText={errors?.address2?.message}
                        variant="outlined"
                        required
                      />
                    )}
                  />

                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="City"
                        type="text"
                        error={!!errors.city}
                        helperText={errors?.city?.message}
                        variant="outlined"
                        required
                      />
                    )}
                  />

                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="State"
                        type="text"
                        error={!!errors.state}
                        helperText={errors?.state?.message}
                        required
                      />
                    )}
                  />

                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <FormControl className="mb-24" required>
                        <InputLabel>Country</InputLabel>
                        <Select
                          {...field}
                          label="Country"
                          error={!!errors.country}
                          // helperText={errors?.country?.message}
                          defaultValue={defaultValues.country}
                        >
                          {countries.map((country) => (
                            <MenuItem key={country.id} value={country.name}>
                              {country.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="zipCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Zip Code/Postal Code"
                        type="text"
                        error={!!errors.zipCode}
                        helperText={errors?.zipCode?.message}
                        required
                      />
                    )}
                  />

                  <div className='flex justify-between'>
                    <LoadingButton
                      variant="contained"
                      color="secondary"
                      aria-label="Update"
                      disabled={(_.isEmpty(dirtyFields) || !isValid)}
                      type="submit"
                      loading={loading}
                    >
                      <span>Update</span>
                    </LoadingButton>
                    <LoadingButton
                      variant="contained"
                      color="secondary"
                      aria-label="Back"
                      onClick={() => setEditEnabled(false)}
                    >
                      <span>Cancel</span>
                    </LoadingButton>
                  </div>
                </form>
              </CardContent>
            </Card>}
        </div>
      </div>
    </motion.div>
  );
}

export default Address;
