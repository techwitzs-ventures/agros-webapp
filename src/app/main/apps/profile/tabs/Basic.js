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
import { Box } from '@mui/material';
import { lighten } from '@mui/material/styles'
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseUtils from '@fuse/utils/FuseUtils';


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
  photoURL: yup.object().shape({
    id: yup.string(),
    url: yup.string(),
    type: yup.string()
  })
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
    photoURL: user.data.photoURL
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

  const { control, formState, handleSubmit, setError, reset, watch } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const handleEditEnable = async () => {
    setEditEnabled(true)
    reset(defaultValues);
  }

  async function onSubmit({ email, mobileno, firstname, lastname, photoURL }) {
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
      zipCode: user.data.zipCode,
      photoURL
    }
    await JwtService.updateUserCredentialByUUID(request, user.tenant_data.tenant_id);
    setEditEnabled(false);
    setLoading(false)
  }

  const profile_image = watch('photoURL');

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

                  <Controller
                    name="photoURL"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Box className="flex justify-start">
                        <Box
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.mode === 'light'
                                ? lighten(theme.palette.background.default, 0.4)
                                : lighten(theme.palette.background.default, 0.02),
                          }}
                          component="label"
                          htmlFor="button-file"
                          className="flex items-center justify-center relative w-128 h-128 rounded-16 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                        >
                          <input
                            accept="image/*"
                            className="hidden"
                            id="button-file"
                            type="file"
                            onChange={async (e) => {
                              function readFileAsync() {
                                return new Promise((resolve, reject) => {
                                  const file = e.target.files[0];
                                  if (!file) {
                                    return;
                                  }
                                  const reader = new FileReader();

                                  reader.onload = () => {
                                    resolve({
                                      id: FuseUtils.generateGUID(),
                                      url: `data:${file.type};base64,${btoa(reader.result)}`,
                                      type: 'image',
                                    });
                                  };

                                  reader.onerror = reject;

                                  reader.readAsBinaryString(file);
                                });
                              }

                              const newImage = await readFileAsync();

                              onChange(newImage);
                            }}
                          />
                          <Box className="flex justify-center items-center"
                            sx={{
                              flexDirection: "column"
                            }}>
                            <FuseSvgIcon size={32} color="action">
                              heroicons-outline:upload
                            </FuseSvgIcon>
                            <Typography>Change Profile</Typography>
                          </Box>
                        </Box>
                        {user.data.photoURL.id !== profile_image.id && <div className='flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow'>
                          <img className="max-w-none w-auto h-full" src={profile_image.url} alt="User Avtar" />
                        </div>}
                      </Box>
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
