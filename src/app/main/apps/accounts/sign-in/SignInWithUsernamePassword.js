import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import _ from '@lodash';
import jwtService from '../auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';

const schema = yup.object().shape({
    mobileno: yup
        .string()
        .required('Enter your Mob.no')
        .matches(
            /^\+91\d{10}$/,
            'Invalid Mob.no format (e.g. +91930***4906)'
        ),
    password: yup
        .string()
        .required('Please enter your password.')
});



function SignInWithUsernamePasswordPage({ usercredential }) {

    const defaultValues = {
        mobileno: usercredential,
        password: ''
    };

    const [loading, setloading] = useState(false);
    const dispatch = useDispatch();

    const { control, formState, handleSubmit, setError, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields, errors } = formState;

    async function onSubmit({ mobileno, password }) {
        setloading(true)
        try {
            const result = await jwtService.signInWithEmailPassword(mobileno, password)
            if (!result.status && result.code === 2) {
                dispatch(showMessage({ message: "Incorrect Username Password", variant: "error" }))
            }
            setloading(false);
            reset(defaultValues);
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
        <form
            name="loginForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Controller
                name="mobileno"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        className="mb-24"
                        label="Mobile No"
                        disabled={loading}
                        type="text"
                        error={!!errors.mobileno}
                        helperText={errors?.mobileno?.message}
                        variant="outlined"
                        required
                        fullWidth
                    />
                )}
            />
            <Controller
                name="password"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        className="mb-24"
                        label="Password"
                        type="password"
                        autoFocus={true}
                        disabled={loading}
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
                loading={loading}
            >
                <span>Sign In</span>
            </LoadingButton>
        </form>
    );
}

export default SignInWithUsernamePasswordPage;
