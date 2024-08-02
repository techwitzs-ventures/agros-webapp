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
import { getItem, newItem, putCustomItem, resetItem, selectItem } from '../store/itemSlice';
import reducer from '../store';
import ItemHeader from './ItemHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import ItemImagesTab from './tabs/ItemImagesTab';
import { getWishlistItem } from '../store/wishlistSlice';
import PricingTab from './tabs/PricingTab';
import AdditionalInfoTab from './tabs/AdditionalInfoTab';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  id: yup.number().required('product id is required')
    .typeError("id must be a numeric value")
    .test('is-number', 'id must be a numeric value', value => !isNaN(value))
});

function Item(props) {

  const dispatch = useDispatch();
  const product = useSelector(selectItem);

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const routeParams = useParams();

  const [tabValue, setTabValue] = useState(0);
  const [noProduct, setNoProduct] = useState(false);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();

  useDeepCompareEffect(() => {
    function updateProductState() {
      const { itemId, wishlistId } = routeParams;

      if (itemId === 'new') {
        /**
         * Create New Product data
         */
        dispatch(newItem());
      } else if (itemId === "newcustom" && wishlistId !== undefined) {
        /**
         * Create New Item when Custom Wishlist Item status is updating
         */
        dispatch(getWishlistItem({
          wishlist_item_id: wishlistId
        })).then((action) => {
          dispatch(putCustomItem(action.payload)).then((action) => {
            if (!action.payload) {
              setNoProduct(true)
            }
          })
        })
      } else {
        /**
         * Get Product data
         */
        const queryparams = {
          id: itemId
        }
        dispatch(getItem(queryparams)).then((action) => {
          /**
           * If the requested product is not exist show message
           */
          if (!action.payload) {
            setNoProduct(true);
          }
        });
      }
    }

    updateProductState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!product) {
      return;
    }
    /**
     * Reset the form on product state changes
     */
    reset(product);
  }, [product, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset Product on component unload
       */
      dispatch(resetItem());
      setNoProduct(false);
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
  if (noProduct) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There is no such product!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/inventory/items"
          color="inherit"
        >
          Go to Products Page
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
        header={<ItemHeader />}
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
              <Tab className="h-64" label="Product Images" />
              <Tab className="h-64" label="Pricing" />
              <Tab className="h-64" label="Additonal Info" />
            </Tabs>
            <div className="p-16 sm:p-24 max-w-3xl">
              <div className={tabValue !== 0 ? 'hidden' : ''}>
                <BasicInfoTab />
              </div>
              <div className={tabValue !== 1 ? 'hidden' : ''}>
                <ItemImagesTab />
              </div>
              <div className={tabValue !== 2 ? 'hidden' : ''}>
                <PricingTab />
              </div>
              <div className={tabValue !== 3 ? 'hidden' : ''}>
                <AdditionalInfoTab />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? 'normal' : 'content'}
      />
    </FormProvider>
  );
}

export default withReducer('inventoryApp', reducer)(Item);
