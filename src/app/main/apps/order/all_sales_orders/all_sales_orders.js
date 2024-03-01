import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import AllSalesOrdersHeader from './all_sales_orders_Header';
import AllSalesOrdersTable from './all_sales_orders_Table';

function AllSalesOrders() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<AllSalesOrdersHeader />}
      content={<AllSalesOrdersTable />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default withReducer('orderApp', reducer)(AllSalesOrders);
