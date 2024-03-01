import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import RecievedSalesOrdersHeader from './recieved_sales_orders_Headers';
import RecievedSalesOrdersTable from './recieved_sales_orders_Table';

function SalesOrders() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<RecievedSalesOrdersHeader />}
      content={<RecievedSalesOrdersTable />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('orderApp', reducer)(SalesOrders);
