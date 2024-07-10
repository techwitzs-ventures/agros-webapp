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
import { getVendor, newVendor, resetVendor, selectVendor } from '../store/vendorSlice';
import VendorHeader from './vendorHeader';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
    email: yup.string().email('Enter a valid email').required(`Enter vendor's Email`).matches(
        /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
        'Invalid email format'
    ),
    countrycode: yup.string().required('Select country code'),
    mobilenumber: yup.string().required(`Enter vendor's Mob.no`).test('is-valid-phone', function (value) {

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
    firstname: yup.string().required('Enter vendor first name').min(2, 'First name must be at least 2 characters'),
    lastname: yup.string().required('Enter vendor last name').min(2, 'Last name must be at least 2 characters'),

});

const defaultValues = {
    email: '',
    countrycode: '+91',
    mobilenumber: '',
    firstname: '',
    lastname: '',
}

function Vendor(props) {

    const dispatch = useDispatch();
    const vendor = useSelector(selectVendor);

    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const routeParams = useParams();

    const [tabValue, setTabValue] = useState(0);
    const [noVendor, setNoVendor] = useState(false);

    const methods = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { reset, watch, control, onChange, formState } = methods;
    const form = watch();

    useDeepCompareEffect(() => {
        function updateVendorState() {

            const { vendorId } = routeParams;

            if (vendorId === 'new') {
                /**
                 * Create New Vendor data
                 */
                dispatch(newVendor());
            } else {
                /**
                 * Get Vendor data
                 */
                const queryparams = {
                    vendor_id: vendorId
                }
                dispatch(getVendor(queryparams)).then((action) => {
                    /**
                     * If the requested vendor is not exist show message
                     */
                    if (!action.payload) {
                        setNoVendor(true);
                    }
                });
            }
        }

        updateVendorState();
    }, [dispatch, routeParams]);

    useEffect(() => {
        if (!vendor) {
            return;
        }
        /**
         * Reset the form on vendor state changes
         */
        reset(vendor);
    }, [vendor, reset]);

    useEffect(() => {
        return () => {
            /**
             * Reset Vendor on component unload
             */
            dispatch(resetVendor());
            setNoVendor(false);
        };
    }, [dispatch]);

    /**
     * Tab Change
     */
    function handleTabChange(event, value) {
        setTabValue(value);
    }

    /**
     * Show Message if the requested vendors is not exists
     */
    if (noVendor) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-col flex-1 items-center justify-center h-full"
            >
                <Typography color="text.secondary" variant="h5">
                    There is no such vendor!
                </Typography>
                <Button
                    className="mt-24"
                    component={Link}
                    variant="outlined"
                    to="/apps/vendors/vendors"
                    color="inherit"
                >
                    Go to Vendors Page
                </Button>
            </motion.div>
        );
    }

    /**
     * Wait while vendor data is loading and form is setted
     */
    if (
        _.isEmpty(form)
    ) {
        return <FuseLoading />;
    }

    return (
        <FormProvider {...methods}>
            <FusePageCarded
                header={<VendorHeader />}
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
                            <Tab className="h-64" label="Vendor Info" />
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

export default withReducer('vendorsApp', reducer)(Vendor);
