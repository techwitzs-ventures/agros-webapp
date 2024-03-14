import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { updateItemsCategoryStatus, saveItemsCategory, updateItemCategory } from '../store/itemsCategorySlice';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';

function ItemsCategoryHeader(props) {
  const dispatch = useDispatch();
  const methods = useFormContext();

  const { formState, watch, handleSubmit } = methods;
  const { isValid, dirtyFields } = formState;

  const items_cat_name = watch('items_cat_name');
  const form = watch();
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector(selectUser)
  const [loading, setloading] = useState(false)
  const [deactivateButtonLoading, setDeactivateButtonLoading] = useState(false)



  function onSubmitNew(data) {
    setloading(true)
    dispatch(saveItemsCategory({
      data,
      tenant_id: user.tenant_id
    })).then(() => {
      navigate('/apps/inventory/itemscategory')
      setloading(false)
    });
  }

  function handleUpdateItemsCategory() {
    setloading(true)
    dispatch(updateItemCategory(form)).then(() => {
      navigate('/apps/inventory/itemscategory')
      setloading(false)
    })
  }

  function handleUpdateItemsCategoryStatus() {
    setDeactivateButtonLoading(true)
    const updated_status = {
      queryparams: form,
      status: form.status ? false : true
    }
    dispatch(updateItemsCategoryStatus(updated_status)).then(() => {
      navigate('/apps/inventory/itemscategory');
      setDeactivateButtonLoading(false)
    });
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
            to="/apps/inventory/itemscategory"
            color="inherit"
          >
            <FuseSvgIcon size={20}>
              {theme.direction === 'ltr'
                ? 'heroicons-outline:arrow-sm-left'
                : 'heroicons-outline:arrow-sm-right'}
            </FuseSvgIcon>
            <span className="flex mx-4 font-medium">Items Category</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <motion.div
            className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.3 } }}
          >
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              {items_cat_name || 'New Items Category'}
            </Typography>
            <Typography variant="caption" className="font-medium">
              Items Category Detail
            </Typography>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >
        {form.status !== undefined && <LoadingButton
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          onClick={handleUpdateItemsCategoryStatus}
          loading={deactivateButtonLoading}
        >
          {form.status ? "Deactivate" : "Activate"}
        </LoadingButton>}

        {form.items_cat_id !== undefined && <LoadingButton
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          loading={loading}
          disabled={_.isEmpty(dirtyFields) || !isValid}
          onClick={handleUpdateItemsCategory}
        >
          Update
        </LoadingButton>}

        {form.items_cat_id === undefined && <LoadingButton
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

export default ItemsCategoryHeader;
