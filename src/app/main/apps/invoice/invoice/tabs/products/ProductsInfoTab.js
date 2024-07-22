import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Card, Typography } from '@mui/material';
import SinglePurchaseOrderTableContent from './ProductsTableContent';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import { getWishlistItems } from 'src/app/main/apps/inventory/store/wishlistItemsSlice';
import { setItemsForPurchaseOrders } from './store/itemlistforPO_Slice';

const ProductsInfoTab = () => {

  const [loading, setloading] = useState(true)

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      const queryparams = {
        tenant_id: user.tenant_id,
        active: true
      }
      dispatch(getWishlistItems(queryparams)).then((response) => {
        dispatch(setItemsForPurchaseOrders(response.payload))
        setloading(false)
      })
    }
  }, [dispatch])

  if (loading) {
    return (
      <FuseLoading />
    )
  }

  return (
    <div className='w-full flex flex-col'>
      <Card component={motion.div} className="flex flex-col mb-24">
        <Typography className="text-15 md:text-15 font-extrabold tracking-tight ms-16 p-4">
          Products
        </Typography>
        <SinglePurchaseOrderTableContent />
      </Card>
    </div>
  )
}

export default withReducer('poDetailsApp', reducer)(ProductsInfoTab);