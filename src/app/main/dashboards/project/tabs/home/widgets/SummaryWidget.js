import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { memo, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectWidgets } from '../../../store/widgetsSlice';
import { selectAllPurchaseOrders } from 'app/store/allPurchaseOrdersSlice';

function SummaryWidget() {
  const data = useSelector(selectAllPurchaseOrders);


  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div className="text-center mt-8">
        <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-blue-500">
          {data.length}
        </Typography>
        <Typography className="text-lg font-medium text-blue-600 dark:text-blue-500">
          Purchase Orders
        </Typography>
      </div>
    </Paper>
  );
}

export default memo(SummaryWidget);
