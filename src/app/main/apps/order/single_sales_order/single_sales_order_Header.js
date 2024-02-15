import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { saveSingleSalesOrder, updateSalesOrder } from '../store/single_sales_order_Slice';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';

function SingleSalesOrderHeader(props) {

  const dispatch = useDispatch();
  const methods = useFormContext();

  const { formState, watch, handleSubmit } = methods;
  const { isValid, dirtyFields } = formState;

  const sales_order_code = watch('sales_order_code')
  const form = watch();
  const routeParams = useParams();

  const theme = useTheme();

  const navigate = useNavigate();
  const user = useSelector(selectUser)

  const { salesorderId, organizationId } = routeParams

  const [loading, setloading] = useState(false)

  function onSubmitNew(data) {
    setloading(true)
    dispatch(saveSingleSalesOrder({
      data,
      org_id: user.organization_id
    })).then(() => {
      navigate('/apps/order/salesorder')
      setloading(false)
    });
  }

  function handleUpdateSalesOrder() {
    setloading(true)
    dispatch(updateSalesOrder(form)).then(() => {
      navigate('/apps/order/salesorder')
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
            to="/apps/order/salesorder"
            color="inherit"
          >
            <FuseSvgIcon size={20}>
              {theme.direction === 'ltr'
                ? 'heroicons-outline:arrow-sm-left'
                : 'heroicons-outline:arrow-sm-right'}
            </FuseSvgIcon>
            <span className="flex mx-4 font-medium">Sales Order</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <motion.div
            className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.3 } }}
          >
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              {sales_order_code || 'New Sales Order'}
            </Typography>
            <Typography variant="caption" className="font-medium">
              Sales Order Detail
            </Typography>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >
        {form.sales_order_id !== undefined && <LoadingButton
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          loading={loading}
          disabled={(salesorderId === "new" && organizationId !== undefined ? !isValid : true) && (_.isEmpty(dirtyFields) || !isValid)}
          onClick={handleUpdateSalesOrder}
        >
          Update
        </LoadingButton>}

        {form.sales_order_id === undefined && <LoadingButton
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          loading={loading}
          disabled={(salesorderId === "new" && organizationId !== undefined ? !isValid : true) && (_.isEmpty(dirtyFields) || !isValid)}
          onClick={handleSubmit(onSubmitNew)}
        >
          Save
        </LoadingButton>}
      </motion.div>
    </div>
  );
}

export default SingleSalesOrderHeader;
