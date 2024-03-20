import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import { useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectUser } from 'app/store/userSlice';
import { LoadingButton } from '@mui/lab';
import { saveWishlistItem } from '../store/wishlistSlice';


function WishlistItemHeader(props) {

  const dispatch = useDispatch();
  const methods = useFormContext();

  const { formState, watch, handleSubmit } = methods;
  const { isValid, dirtyFields } = formState;
  const routeParams = useParams();

  const featuredImageId = watch('featuredImageId');
  const images = watch('images');
  const item_name = watch('item_name');

  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector(selectUser)

  const { param1, param2 } = routeParams;

  const [loading, setloading] = useState(false)


  function onSubmitNew(data) {
    setloading(true)
    const new_item = {
      data,
      org_id: user.tenant_id
    }
    dispatch(saveWishlistItem(new_item)).then(() => {
      navigate('/apps/inventory/itemswishlist')
      setloading(false)
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
            to='/apps/inventory/itemswishlist'
            color="inherit"
          >
            <FuseSvgIcon size={20}>
              {theme.direction === 'ltr'
                ? 'heroicons-outline:arrow-sm-left'
                : 'heroicons-outline:arrow-sm-right'}
            </FuseSvgIcon>
            <span className="flex mx-4 font-medium">Item</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <motion.div
            className="hidden sm:flex"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.3 } }}
          >
            {images.length > 0 && featuredImageId ? (
              <img
                className="w-32 sm:w-48 rounded"
                src={_.find(images, { id: featuredImageId }).url}
                alt={item_name}
              />
            ) : (
              <img
                className="w-32 sm:w-48 rounded"
                src="assets/images/apps/ecommerce/product-image-placeholder.png"
                alt={item_name}
              />
            )}
          </motion.div>
          <motion.div
            className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.3 } }}
          >
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              {item_name || 'New Item'}
            </Typography>
            <Typography variant="caption" className="font-medium">
              Item Detail
            </Typography>
          </motion.div>
        </div>
      </div>
      {param1 === "new" && <motion.div
        className="flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >
        <LoadingButton
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          loading={loading}
          disabled={(param1 === "new" && param2 !== undefined ? !isValid : true) && (_.isEmpty(dirtyFields) || !isValid)}
          onClick={handleSubmit(onSubmitNew)}
        >
          Save
        </LoadingButton>
      </motion.div>}
    </div>
  );
}

export default WishlistItemHeader;
