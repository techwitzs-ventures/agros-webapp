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
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import {
  getSinglePurchaseOrder,
  resetSinglePurchaseOrder,
  selectSinglePurchaseOrder
} from '../store/single_purchase_order_Slice';
import reducer from '../store';
import ViewSinglePurchaseOrderHeader from './view_single_purchase_order_Header';
import BasicInfoTab from './tabs/BasicInfoTab';

/**
 * Form Validation Schema
 */


function ViewSinglePurchaseOrder(props) {

  const dispatch = useDispatch();
  const purchaseorder = useSelector(selectSinglePurchaseOrder);

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const routeParams = useParams();

  const [tabValue, setTabValue] = useState(0);
  const [noPurchaseOrder, setnoPurchaseOrder] = useState(false);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();

  useDeepCompareEffect(() => {
    function updatePurchaseOrderState() {
      const { purchaseorderId, organizationId } = routeParams;
        /**
         * Get Purchase Order data
         */
        const queryparams = {
          purchase_order_id: purchaseorderId,
          organization_id: organizationId
        }
        dispatch(getSinglePurchaseOrder(queryparams)).then((action) => {
          /**
           * If the requested product is not exist show message
           */
          if (!action.payload) {
            setnoPurchaseOrder(true);
          }
        });
      }
    updatePurchaseOrderState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!purchaseorder) {
      return;
    }
    /**
     * Reset the form on purchase order state changes
     */
    reset(purchaseorder);
  }, [purchaseorder, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset Product on component unload
       */
      dispatch(resetSinglePurchaseOrder());
      setnoPurchaseOrder(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  /**
   * Show Message if the requested products is not exists
   */
  if (noPurchaseOrder) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There is no such purchase order!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/order/recievedpurchaseorder"
          color="inherit"
        >
          Go to Purchase Orders Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while product data is loading and form is setted
   */
  if (
    _.isEmpty(form)
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<ViewSinglePurchaseOrderHeader />}
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
              <Tab className="h-64" label="Purchase Order Info" />
            </Tabs>
            <div className="p-16 sm:p-24">
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

export default withReducer('orderApp', reducer)(ViewSinglePurchaseOrder);
