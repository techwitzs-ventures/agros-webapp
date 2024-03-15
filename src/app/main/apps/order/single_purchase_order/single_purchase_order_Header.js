import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import { useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
  updatePurchaseOrder,
  saveSinglePurchaseOrder
} from '../store/single_purchase_order_Slice';
import { selectUser } from 'app/store/userSlice';
import { LoadingButton } from '@mui/lab';


function SinglePurchaseOrderHeader(props) {

  const dispatch = useDispatch();
  const methods = useFormContext();

  const { formState, watch, handleSubmit } = methods;
  const { isValid, dirtyFields } = formState;

  const purchase_order_code = watch('purchase_order_code')
  const form = watch()

  const theme = useTheme();
  const navigate = useNavigate();

  const user = useSelector(selectUser)

  const [loading, setloading] = useState(false)


  function onSubmitNew(data) {
    setloading(true)
    dispatch(saveSinglePurchaseOrder({
      data,
      org_id: user.tenant_id
    })).then(() => {
      navigate('/apps/order/purchaseorder')
      setloading(false)
    });
  }

  function handleUpdatePurchaseOrder(){
    setloading(true)
    dispatch(updatePurchaseOrder(form)).then(()=>{
      navigate('/apps/order/purchaseorder')
      setloading(false)
    })
  }

  return (
    <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-32 px-24 md:px-32">
      <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
        >
          <Typography
            className="flex items-center sm:mb-12"
            component={Link}
            role="button"
            to="/apps/order/purchaseorder"
            color="inherit"
          >
            <FuseSvgIcon size={20}>
              {theme.direction === 'ltr'
                ? 'heroicons-outline:arrow-sm-left'
                : 'heroicons-outline:arrow-sm-right'}
            </FuseSvgIcon>
            <span className="flex mx-4 font-medium">Purchase Order</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <motion.div
            className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.3 } }}
          >
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              {purchase_order_code || 'New Purchase Order'}
            </Typography>
            <Typography variant="caption" className="font-medium">
              Purchase Order Detail
            </Typography>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >

        {form.purchase_order_id !== undefined && <LoadingButton
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          loading={loading}
          disabled={_.isEmpty(dirtyFields) || !isValid}
          onClick={handleUpdatePurchaseOrder}
        >
          Update
        </LoadingButton>}
        
        {form.purchase_order_id === undefined && <LoadingButton
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          loading={loading}
          disabled={_.isEmpty(dirtyFields) || !isValid}
          onClick={handleSubmit(onSubmitNew)}
        >
          Save
        </LoadingButton>}
      </motion.div>
    </div>
  );
}

export default SinglePurchaseOrderHeader;
