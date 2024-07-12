import React from 'react'
import { motion } from "framer-motion";
import { Card, Typography } from '@mui/material';
import SinglePurchaseOrderTableContent from './ProductsTableContent';
import withReducer from 'app/store/withReducer';
import reducer from './store';

const ProductsInfoTab = () => {
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