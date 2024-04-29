import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { memo, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectAllItems } from 'app/store/allItemsSlice';
import { selectUser } from 'app/store/userSlice';
import { selectProductCount } from '../../../store/informationSlice';

function SummaryWidget() {
  const user = useSelector(selectUser)
  const data = user.role === "plateformadmin" ? useSelector(selectAllItems) : useSelector(selectProductCount)

  return (
    <Paper className="flex flex-col justify-center items-center flex-auto shadow rounded-2xl overflow-hidden" style={{ height: "221px" }}>
      <div className="text-center mt-8">
        <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-blue-500">
          {data.length}
        </Typography>
        <Typography className="text-lg font-medium text-blue-600 dark:text-blue-500">
          Products
        </Typography>
      </div>
    </Paper>
  );
}

export default memo(SummaryWidget);
