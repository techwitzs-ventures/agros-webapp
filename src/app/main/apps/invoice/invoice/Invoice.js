import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { getInvoice, newInvoice, resetInvoice, saveInvoice, selectInvoice } from '../store/invoiceSlice';
import reducer from '../store';
import BasicInfoTab from './tabs/BasicInfoTab';
import ProductsInfoTab from './tabs/products/ProductsInfoTab';
import AdditonalInfoTab from './tabs/AdditionalInfoTab';
import { Box, Step, StepLabel, Stepper, styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { LoadingButton } from '@mui/lab';
import { selectUser } from 'app/store/userSlice';

const steps = ['Basic Info', 'Products Info', 'Additional Info'];

const CustomStepIconRoot = styled('div')(({ theme, onboardingStep }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 50,  // Adjusted size of the circle
  height: 50, // Adjusted size of the circle
  borderRadius: '50%',
  backgroundColor: onboardingStep.completed ? theme.palette.success.main : theme.palette.primary.main,
  color: onboardingStep.completed ? theme.palette.common.white : theme.palette.success.main,
  border: `2px solid ${onboardingStep.active ? theme.palette.success.main : 'transparent'}`,
  fontWeight: 'bold',
  fontSize: '2rem', // Adjusted font size for the number
  ...(onboardingStep.active && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.success.main,
  }),
  '& .MuiSvgIcon-root': {
    fontSize: '2rem', // Adjusted size of the tick icon
  },
}));

function CustomStepIcon(props) {
  const { active, completed, icon } = props;

  return (
    <CustomStepIconRoot onboardingStep={{ active, completed }}>
      {completed ? <CheckIcon /> : icon}
    </CustomStepIconRoot>
  );
}

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
  const user = useSelector(selectUser);

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const routeParams = useParams();

  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setloading] = useState(false)
  const [noInvoice, setNoInvoice] = useState(false);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const { reset, watch, control, onChange, handleSubmit, formState } = methods;
  const { isValid, dirtyFields } = formState;
  const form = watch();
  const invoice_id = watch('invoice_id');

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
          setActiveStep(3)

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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (
    _.isEmpty(form)
  ) {
    return <FuseLoading />;
  }

  function onSubmitNew(data) {
    setloading(true)
    dispatch(saveInvoice({
      data,
      tenant_id: user.tenant_id,
      stripe_account_id: user.tenant_data.account_id
    })).then(() => {
      navigate('/apps/invoice/invoices')
      setloading(false)
    });

  }

  function downloadInvoice() {
    console.log("Invoice Downloaded!");
  }


  return (
    <FormProvider {...methods}>
      <FusePageCarded
        content={
          <>
            <Box className="flex flex-col items-center mt-32" sx={{ width: '100%' }}>

              <Stepper sx={{ fontSize: "30px" }} className='w-5/6 sm:w-3/4 md:w-3/5 lg:w-4/5' activeStep={activeStep} alternativeLabel>

                {steps.map((label, index) => {
                  return (
                    <Step key={label}>
                      <StepLabel
                        StepIconComponent={(props) => <CustomStepIcon {...props} icon={index + 1} />}
                        sx={{
                          '& .MuiStepLabel-label': {
                            fontSize: '18px',
                            fontWeight: 'bold',
                          },
                          '& .MuiStepLabel-root': {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                          '& .MuiStepConnector-line': {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>

              <Box className="flex flex-col lg:items-center w-5/6 sm:w-3/4 md:w-2/5 lg:w-3/5" sx={{ mt: 6 }}>

                {activeStep === 0 && <BasicInfoTab />}
                {activeStep === 1 && <ProductsInfoTab />}
                {activeStep === 2 && <AdditonalInfoTab />}
                {activeStep === steps.length &&
                  <motion.div
                    className="flex justify-center items-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
                  >

                    <LoadingButton
                      className="whitespace-nowrap mx-4"
                      variant="contained"
                      color="secondary"
                      loading={loading}
                      disabled={invoice_id !== undefined ? false : (_.isEmpty(dirtyFields) || !isValid)}
                      onClick={invoice_id !== undefined ? downloadInvoice : handleSubmit(onSubmitNew)}
                    >
                      {invoice_id !== undefined ? 'Download Invoice' : 'Save Invoice'}
                    </LoadingButton>
                  </motion.div>}

                <Box className="w-full" sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  pt: 2,
                  justifyContent: activeStep === 0 || activeStep === steps.length ? "end" : "space-between"
                }}>

                  {activeStep !== 0 &&
                    <Button
                      variant='contained'
                      color="secondary"
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>}

                  {activeStep !== steps.length && <Button
                    variant='contained'
                    onClick={handleNext}
                    color='secondary'
                    disabled={
                      activeStep === 0
                        ?
                        form.customer_id !== '' ? false : true
                        :
                        activeStep === 1
                          ?
                          form.item_list[0].item_id !== '' && form.item_list[0].quantity !== '' ? false : true
                          :
                          activeStep === 2
                            &&
                            form.currency !== '' ? false : true

                    }
                  >
                    {(activeStep === steps.length - 1) && invoice_id === undefined ?
                      'Finish' :
                      'Next'
                    }
                  </Button>}

                </Box>

              </Box>

            </Box>
          </>
        }
        scroll={isMobile ? 'normal' : 'content'}
      />
    </FormProvider>
  );
}

export default withReducer('invoiceApp', reducer)(Invoice);
