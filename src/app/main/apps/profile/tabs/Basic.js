import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
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
  email: yup.string().email('Enter a valid email').required('Enter a Email'),
  mobileno: yup
    .string()
    .required('Enter your Mobile Number')
    .matches(
      /^(?:\+\d{1,3}\s?)?(?:\d{10}|\d{3}[-\s]?\d{4}[-\s]?\d{3})$/,
      'Invalid mobile number format'
    ),
  firstname: yup.string().required('Enter your Firstname').min(2),
  lastname: yup.string().required('Enter your Lastname').min(2),
});



function Basic() {
  const user = useSelector(selectUser);
  const test = (x) => x + 1;
  const [editEnabled, setEditEnabled] = useState(false)
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    email: user.data.email,
    mobileno: user.data.mobilenumber,
    firstname: user.data.firstname,
    lastname: user.data.lastname,
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

  async function onSubmit({ email, mobileno, firstname, lastname }) {
    setLoading(true)
    const request = {
      email,
      mobilenumber: mobileno,
      firstname,
      lastname,
      address1: user.data.address1,
      address2: user.data.address2,
      city: user.data.city,
      state: user.data.state,
      country: user.data.country,
      zipCode: user.data.zipCode
    }
    await JwtService.updateUserCredentialByUUID(request, user.tenant_data.tenant_id);
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
                  <Typography className="font-semibold mb-4 text-15">First Name</Typography>
                  <Typography>{user.data.firstname}</Typography>
                </div>

                <div className="mb-24">
                  <Typography className="font-semibold mb-4 text-15">Last Name</Typography>
                  <Typography>{user.data.lastname}</Typography>
                </div>

                <div className="mb-24">
                  <Typography className="font-semibold mb-4 text-15">Email</Typography>
                  <Typography>{user.data.email}</Typography>
                </div>

                <div className="mb-24">
                  <Typography className="font-semibold mb-4 text-15">Phone Number</Typography>
                  <Typography>{user.data.mobilenumber}</Typography>
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
                      />
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Email"
                        type="email"
                        disabled
                        error={!!errors.email}
                        helperText={errors?.email?.message}
                        variant="outlined"
                        required
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
                        disabled
                        error={!!errors.mobileno}
                        helperText={errors?.mobileno?.message}
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

export default Basic;
