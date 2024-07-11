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
import { getInvoice, newInvoice, resetInvoice, selectInvoice } from '../store/invoiceSlice';
import reducer from '../store';
import InvoiceHeader from './InvoiceHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import ProductsInfoTab from './tabs/products/ProductsInfoTab';
import AdditonalInfoTab from './tabs/AdditionalInfoTab';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  customer_id: yup.string().required("Select Customer"),
  item_list: yup
    .array()
    .of(
      yup.object().shape({
        item_id: yup.string().required('Item ID is required'),
        unit: yup.string().required('Unit is required'),
        rate: yup.string().required('Rate is required'),
        quantity: yup.string().required('Quantity is required'),
        amount: yup.string().required('Amount is required'),
      })
    )
    .min(1, 'At least one item is required'),
  currency: yup.string().required('Enter currency code'),
  total_amount: yup.number().required('Total Amount is required')
    .typeError("Total amount must be a numeric value")
    .test('is-number', 'Total amount must be a numeric value', value => !isNaN(value))
});

function Invoice(props) {

  const dispatch = useDispatch();
  const invoice = useSelector(selectInvoice);

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const routeParams = useParams();

  const [tabValue, setTabValue] = useState(0);
  const [noInvoice, setNoInvoice] = useState(false);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();

  useDeepCompareEffect(() => {

    function updateInvoiceState() {

      const { invoiceId } = routeParams;

      if (invoiceId === 'new') {

        dispatch(newInvoice());

      } else {

        const queryparams = {
          invoice_id: invoiceId
        }

        dispatch(getInvoice(queryparams)).then((action) => {

          if (!action.payload) {
            setNoInvoice(true);
          }

        });

      }

    }

    updateInvoiceState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!invoice) {
      return;
    }

    reset(invoice);
  }, [invoice, reset]);

  useEffect(() => {
    return () => {

      dispatch(resetInvoice());
      setNoInvoice(false);
    };
  }, [dispatch]);

  function handleTabChange(event, value) {
    setTabValue(value);
  }

  if (noInvoice) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There is no such invoice!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/invoice/invoices"
          color="inherit"
        >
          Go to Invoices Page
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form)
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<InvoiceHeader />}
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
              <Tab className="h-64" label="Basic Info" />
              <Tab className="h-64" label="Products Info" />
              <Tab className="h-64" label="Additional Info" />
            </Tabs>
            <div className="p-16 sm:p-24 max-w-3xl">
              <div className={tabValue !== 0 ? 'hidden' : ''}>
                <BasicInfoTab />
              </div>
              <div className={tabValue !== 1 ? 'hidden' : ''}>
                <ProductsInfoTab />
              </div>
              <div className={tabValue !== 2 ? 'hidden' : ''}>
                <AdditonalInfoTab />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? 'normal' : 'content'}
      />
    </FormProvider>
  );
}

export default withReducer('invoiceApp', reducer)(Invoice);
