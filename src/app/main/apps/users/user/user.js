import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import BasicInfoTab from './tabs/BasicInfoTab';
import { getUser, newUser, resetUser, selectUser } from '../store/userSlice';
import UserHeader from './userHeader';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
    email: yup.string().email('Enter a valid email').required(`Enter user's Email`).matches(
        /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
        'Invalid email format'
    ),
    countrycode: yup.string().required('Select country code'),
    mobilenumber: yup.string().required(`Enter user's Mob.no`).test('is-valid-phone', function (value) {

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
    firstname: yup.string().required('Enter user first name').min(2, 'First name must be at least 2 characters'),
    lastname: yup.string().required('Enter user last name').min(2, 'Last name must be at least 2 characters'),

});

const defaultValues = {
    email: '',
    countrycode: '+91',
    mobilenumber: '',
    firstname: '',
    lastname: '',
}

function User(props) {

    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const routeParams = useParams();

    const [tabValue, setTabValue] = useState(0);
    const [noUser, setNoUser] = useState(false);

    const methods = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { reset, watch, control, onChange, formState } = methods;
    const form = watch();

    useDeepCompareEffect(() => {
        function updateUserState() {

            const { userId } = routeParams;

            if (userId === 'new') {
                /**
                 * Create New User data
                 */
                dispatch(newUser());
            } else {
                /**
                 * Get User data
                 */
                const queryparams = {
                    user_id: userId
                }
                dispatch(getUser(queryparams)).then((action) => {
                    /**
                     * If the requested user is not exist show message
                     */
                    if (!action.payload) {
                        setNoUser(true);
                    }
                });
            }
        }

        updateUserState();
    }, [dispatch, routeParams]);

    useEffect(() => {
        if (!user) {
            return;
        }
        /**
         * Reset the form on user state changes
         */
        reset(user);
    }, [user, reset]);

    useEffect(() => {
        return () => {
            /**
             * Reset User on component unload
             */
            dispatch(resetUser());
            setNoUser(false);
        };
    }, [dispatch]);

    /**
     * Tab Change
     */
    function handleTabChange(event, value) {
        setTabValue(value);
    }

    /**
     * Show Message if the requested users is not exists
     */
    if (noUser) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-col flex-1 items-center justify-center h-full"
            >
                <Typography color="text.secondary" variant="h5">
                    There is no such user!
                </Typography>
                <Button
                    className="mt-24"
                    component={Link}
                    variant="outlined"
                    to="/apps/users/users"
                    color="inherit"
                >
                    Go to Users Page
                </Button>
            </motion.div>
        );
    }

    /**
     * Wait while user data is loading and form is setted
     */
    if (
        _.isEmpty(form)
    ) {
        return <FuseLoading />;
    }

    return (
        <FormProvider {...methods}>
            <FusePageCarded
                header={<UserHeader />}
                content={
                    <>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            indicatorColor="secondary"
                            textColor="secondary"
                            variant="scrollable"
                            scrollButtons="auto"
                            classes={{ root: 'w-full h-64 border-b-1' }}
                        >
                            <Tab className="h-64" label="User Info" />
                        </Tabs>
                        <div className="p-16 sm:p-24 max-w-3xl">
                            <div className={tabValue !== 0 ? 'hidden' : ''}>
                                <BasicInfoTab />
                            </div>
                        </div>
                    </>
                }
                scroll={isMobile ? 'normal' : 'content'}
            />
        </FormProvider>
    );
}

export default withReducer('usersApp', reducer)(User);
