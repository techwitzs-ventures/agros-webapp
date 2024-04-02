import FuseLoading from "@fuse/core/FuseLoading";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { useDeepCompareEffect } from "@fuse/hooks";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import withReducer from "app/store/withReducer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import _ from "@lodash";
import { FormProvider, useForm } from "react-hook-form";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import {
  getSingleSalesOrder,
  resetSingleSalesOrder,
  selectSingleSalesOrder,
} from "../store/single_sales_order_Slice";
import reducer from "../store";
import ViewSingleSalesOrderHeader from "./view_single_sales_order_Header";
import BasicInfoTab from "./tabs/BasicInfoTab";
import { selectUser } from "app/store/userSlice";

/**
 * Form Validation Schema
 */

function ViewSingleSalesOrder(props) {
  
  const dispatch = useDispatch();
  const salesorder = useSelector(selectSingleSalesOrder);

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const user = useSelector(selectUser)
  
  const routeParams = useParams();

  const [tabValue, setTabValue] = useState(0);
  const [noProduct, setNoProduct] = useState(false);

  const methods = useForm({
    mode: "onChange",
    defaultValues: {},
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();

  useDeepCompareEffect(() => {
    function updateProductState() {
      const { salesorderId, tenantId } = routeParams;
        /**
         * Get Product data
         */
        const queryparams = {
          sales_order_id: salesorderId,
          tenant_id: tenantId,
        };
        dispatch(getSingleSalesOrder(queryparams)).then((action) => {
          /**
           * If the requested product is not exist show message
           */
          if (!action.payload) {
            setNoProduct(true);
          }
        });
    }

    updateProductState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!salesorder) {
      return;
    }
    /**
     * Reset the form on product state changes
     */
    reset(salesorder);
  }, [salesorder, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset Product on component unload
       */
      dispatch(resetSingleSalesOrder());
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
          There is no such Sales Order!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to={user.role==="retailer"?"/apps/order/recievedsalesorder":"/apps/order/salesorder"}
          color="inherit"
        >
          Go to Sales Order Page
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
        header={<ViewSingleSalesOrderHeader />}
        content={
          <>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "w-full h-64 border-b-1" }}
            >
              <Tab className="h-64" label="Sales Order Info" />
            </Tabs>
            <div className="p-16 sm:p-24">
              <div className={tabValue !== 0 ? "hidden" : ""}>
                <BasicInfoTab />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("orderApp", reducer)(ViewSingleSalesOrder);
