import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectWidgets } from '../../../store/widgetsSlice';
import { selectAllinvoices } from 'app/store/allInvoicesSlice';

function IssuesWidget() {
  const data = useSelector(selectAllinvoices);

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div className="text-center mt-8">
        <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-amber-500">
          {data.length}
        </Typography>
        <Typography className="text-lg font-medium text-amber-600">Invoices</Typography>
      </div>
    </Paper>
  );
}

export default memo(IssuesWidget);
