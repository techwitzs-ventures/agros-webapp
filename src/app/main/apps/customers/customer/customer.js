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
import { getCustomer, newCustomer, resetCustomer, selectCustomer } from '../store/customerSlice';
import CustomerHeader from './customerHeader';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
    email: yup.string().email('Enter a valid email').required(`Enter customer's Email`).matches(
        /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
        'Invalid email format'
    ),
    countrycode: yup.string().required('Select country code'),
    phone: yup.string().required(`Enter customer's Mob.no`).test('is-valid-phone', function (value) {

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
    name: yup.string().required('Enter customer name').min(2, 'Name must be at least 2 characters'),
});

const defaultValues = {
    email: '',
    countrycode: '+91',
    phone: '',
    name: ''
}

function Customer(props) {

    const dispatch = useDispatch();
    const customer = useSelector(selectCustomer);

    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const routeParams = useParams();

    const [tabValue, setTabValue] = useState(0);
    const [noCustomer, setNoCustomer] = useState(false);

    const methods = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { reset, watch, control, onChange, formState } = methods;
    const form = watch();

    useDeepCompareEffect(() => {
        function updateCustomerState() {

            const { customerId } = routeParams;

            if (customerId === 'new') {
                /**
                 * Create New Customer data
                 */
                dispatch(newCustomer());
            } else {
                /**
                 * Get Customer data
                 */
                const queryparams = {
                    customer_id: customerId
                }
                dispatch(getCustomer(queryparams)).then((action) => {
                    /**
                     * If the requested customer is not exist show message
                     */
                    if (!action.payload) {
                        setNoCustomer(true);
                    }
                });
            }
        }

        updateCustomerState();
    }, [dispatch, routeParams]);

    useEffect(() => {
        if (!customer) {
            return;
        }
        /**
         * Reset the form on customer state changes
         */
        reset(customer);
    }, [customer, reset]);

    useEffect(() => {
        return () => {
            /**
             * Reset Customer on component unload
             */
            dispatch(resetCustomer());
            setNoCustomer(false);
        };
    }, [dispatch]);

    /**
     * Tab Change
     */
    function handleTabChange(event, value) {
        setTabValue(value);
    }

    /**
     * Show Message if the requested customers is not exists
     */
    if (noCustomer) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-col flex-1 items-center justify-center h-full"
            >
                <Typography color="text.secondary" variant="h5">
                    There is no such customer!
                </Typography>
                <Button
                    className="mt-24"
                    component={Link}
                    variant="outlined"
                    to="/apps/customers/customers"
                    color="inherit"
                >
                    Go to Customers Page
                </Button>
            </motion.div>
        );
    }

    /**
     * Wait while customer data is loading and form is setted
     */
    if (
        _.isEmpty(form)
    ) {
        return <FuseLoading />;
    }

    return (
        <FormProvider {...methods}>
            <FusePageCarded
                header={<CustomerHeader />}
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
                            <Tab className="h-64" label="Customer Info" />
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

export default withReducer('customersApp', reducer)(Customer);
