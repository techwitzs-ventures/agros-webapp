import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectWidgets } from '../../../store/widgetsSlice';
import { selectAllSalesOrders } from 'app/store/allSalesOrdersSlice';

function OverdueWidget() {
  const data = useSelector(selectAllSalesOrders);

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div className="text-center mt-8">
        <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-red-500">
          {data.length}
        </Typography>
        <Typography className="text-lg font-medium text-red-600">Sales Orders</Typography>
      </div>
    </Paper>
  );
}

export default memo(OverdueWidget);
